'use client'

import { useEffect, useRef, useState } from 'react'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipForward,
  Settings,
  X
} from 'lucide-react'

/**
 * Компонент видеоплеера с интеграцией Kodik API
 * Документация: https://kodik.info/api-documentation
 */
export default function VideoPlayer({ 
  playerLink, 
  title,
  onClose 
}) {
  const iframeRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [currentEpisode, setCurrentEpisode] = useState(null)
  const [speed, setSpeed] = useState(1)
  const [isPiP, setIsPiP] = useState(false)

  useEffect(() => {
    // Слушатель сообщений от плеера
    function kodikMessageListener(message) {
      if (!message.data || !message.data.key) return

      switch (message.data.key) {
        case 'kodik_player_play':
          setIsPlaying(true)
          break
        
        case 'kodik_player_pause':
          setIsPlaying(false)
          break
        
        case 'kodik_player_seek':
          if (message.data.value?.time) {
            setCurrentTime(message.data.value.time)
          }
          break
        
        case 'kodik_player_time_update':
          setCurrentTime(message.data.value)
          break
        
        case 'kodik_player_duration_update':
          setDuration(message.data.value)
          break
        
        case 'kodik_player_volume_change':
          if (message.data.value) {
            setVolume(message.data.value.volume)
            setIsMuted(message.data.value.muted)
          }
          break
        
        case 'kodik_player_current_episode':
          setCurrentEpisode(message.data.value)
          break
        
        case 'kodik_player_speed_change':
          if (message.data.value?.speed) {
            setSpeed(message.data.value.speed)
          }
          break
        
        case 'kodik_player_enter_pip':
          setIsPiP(true)
          break
        
        case 'kodik_player_exit_pip':
          setIsPiP(false)
          break
        
        case 'kodik_player_video_started':
          console.log('Видео началось')
          break
        
        case 'kodik_player_video_ended':
          console.log('Видео завершилось')
          setIsPlaying(false)
          break
        
        case 'kodik_player_skip_button':
          console.log('Нажата кнопка:', message.data.value?.title)
          break
        
        case 'kodik_player_time':
          // Ответ на get_time
          console.log('Точное время:', message.data.value)
          break
      }
    }

    if (window.addEventListener) {
      window.addEventListener('message', kodikMessageListener)
    } else {
      window.attachEvent('onmessage', kodikMessageListener)
    }

    return () => {
      if (window.removeEventListener) {
        window.removeEventListener('message', kodikMessageListener)
      } else {
        window.detachEvent('onmessage', kodikMessageListener)
      }
    }
  }, [])

  // Функция для отправки команд плееру
  const sendCommand = (command) => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(
        { key: 'kodik_player_api', value: command },
        '*'
      )
    }
  }

  // Управление воспроизведением
  const handlePlayPause = () => {
    sendCommand({ method: isPlaying ? 'pause' : 'play' })
  }

  // Перемотка
  const handleSeek = (seconds) => {
    sendCommand({ method: 'seek', seconds })
  }

  // Управление громкостью
  const handleVolumeChange = (newVolume) => {
    sendCommand({ method: 'volume', volume: newVolume })
  }

  // Выключение/включение звука
  const handleMuteToggle = () => {
    sendCommand({ method: isMuted ? 'unmute' : 'mute' })
  }

  // Смена скорости
  const handleSpeedChange = (newSpeed) => {
    sendCommand({ method: 'speed', speed: newSpeed })
  }

  // Переключение эпизода
  const handleEpisodeChange = (season, episode) => {
    sendCommand({ method: 'change_episode', season, episode })
  }

  // Picture-in-Picture
  const handlePiPToggle = () => {
    sendCommand({ method: isPiP ? 'exit_pip' : 'enter_pip' })
  }

  // Получить текущее время
  const handleGetTime = () => {
    sendCommand({ method: 'get_time' })
  }

  // Форматирование времени
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!playerLink) {
    return (
      <div className="flex items-center justify-center min-h-[500px] bg-dark-800 rounded-2xl">
        <div className="text-center">
          <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Плеер недоступен</p>
        </div>
      </div>
    )
  }

  // Убираем протокол // и добавляем https://
  const fullPlayerLink = playerLink.startsWith('//') 
    ? `https:${playerLink}` 
    : playerLink

  return (
    <div className="relative w-full">
      {/* Заголовок плеера */}
      <div className="flex items-center justify-between mb-4 px-4 py-3 rounded-xl glass-effect">
        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          {currentEpisode && (
            <p className="text-sm text-gray-400 mt-1">
              {currentEpisode.season && `Сезон ${currentEpisode.season}, `}
              {currentEpisode.episode && `Эпизод ${currentEpisode.episode}`}
              {currentEpisode.translation && ` • ${currentEpisode.translation.title}`}
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {/* Iframe плеера */}
      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-crimson-primary/20 bg-black">
        <iframe
          ref={iframeRef}
          src={fullPlayerLink}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          allow="autoplay *; fullscreen *"
        />
      </div>

      {/* Информационная панель */}
      <div className="mt-4 px-4 py-3 rounded-xl glass-effect">
        <div className="flex items-center justify-between text-sm text-gray-300">
          <div className="flex items-center space-x-4">
            <span>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            {speed !== 1 && (
              <span className="text-crimson-light">
                Скорость: {speed}x
              </span>
            )}
            {isPiP && (
              <span className="text-crimson-light">
                Picture-in-Picture
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-gray-500" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
            <span>{Math.round(volume * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Дополнительные контролы (опционально) */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => handleSeek(currentTime - 10)}
          className="px-4 py-2 rounded-lg glass-effect hover:bg-white hover:bg-opacity-10 text-white text-sm transition-all"
        >
          -10 сек
        </button>
        <button
          onClick={() => handleSeek(currentTime + 10)}
          className="px-4 py-2 rounded-lg glass-effect hover:bg-white hover:bg-opacity-10 text-white text-sm transition-all"
        >
          +10 сек
        </button>
        <button
          onClick={() => handleSpeedChange(speed === 1 ? 1.5 : 1)}
          className="px-4 py-2 rounded-lg glass-effect hover:bg-white hover:bg-opacity-10 text-white text-sm transition-all"
        >
          Скорость: {speed}x
        </button>
      </div>
    </div>
  )
}

