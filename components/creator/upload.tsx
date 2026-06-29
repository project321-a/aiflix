'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload as UploadIcon, Link2, Info, FileVideo, Image } from 'lucide-react'

const segments = [
  'Power Struggle', 'War God', 'Tycoon Life', 'Workplace', 'Time Travel', 'Apocalypse'
]

const genres = [
  'Action', 'Romance', 'Drama', 'Thriller', 'Sci-Fi', 
  'Historical', 'Fantasy', 'Crime', 'Documentary', 'Horror', 'Comedy'
]

const regions = [
  'Africa', 'KDrama', 'CDrama', 'Europe', 'Japan', 'USA', 'India', 'Latin America'
]

export default function Upload() {
  const router = useRouter()
  
  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [genre, setGenre] = useState('Action')
  const [region, setRegion] = useState('Africa')
  const [type, setType] = useState('movie')
  const [segment, setSegment] = useState('Power Struggle')
  const [videoUrl, setVideoUrl] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('url')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadError, setUploadError] = useState('')
  
  const videoInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0])
    }
  }

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title) {
      setUploadError('Title is required')
      return
    }

    if (uploadMethod === 'url' && !videoUrl) {
      setUploadError('Video URL is required')
      return
    }

    if (uploadMethod === 'file' && !videoFile) {
      setUploadError('Please select a video file')
      return
    }

    setUploading(true)
    setUploadError('')
    setUploadMessage('')

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description || '')
      formData.append('genre', genre)
      formData.append('region', region)
      formData.append('type', type)
      formData.append('segment', segment)
      
      if (uploadMethod === 'url') {
        formData.append('videoUrl', videoUrl)
        formData.append('thumbnailUrl', thumbnailUrl || '')
      } else if (uploadMethod === 'file' && videoFile) {
        formData.append('videoFile', videoFile)
        if (thumbnailFile) {
          formData.append('thumbnailUrl', thumbnailUrl || '')
        }
      }

      const res = await fetch('/api/creator/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (res.ok) {
        setUploadMessage('✅ Video uploaded successfully!')
        setTitle('')
        setDescription('')
        setVideoUrl('')
        setThumbnailUrl('')
        setVideoFile(null)
        setThumbnailFile(null)
        if (videoInputRef.current) videoInputRef.current.value = ''
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = ''
        setTimeout(() => setUploadMessage(''), 5000)
      } else {
        setUploadError(data.error || 'Upload failed')
      }
    } catch (error) {
      setUploadError('Something went wrong')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-2">Upload New Video</h2>
        <p className="text-sm text-gray-400 mb-6">
          Add your AI-generated video to the platform
        </p>

        {uploadMessage && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-lg mb-4 text-sm">
            {uploadMessage}
          </div>
        )}
        {uploadError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4 text-sm">
            {uploadError}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-6">

          {/* Section: Basic Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your content..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Genre</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  >
                    {genres.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Region</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  >
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="movie">Movie</option>
                    <option value="series">Series</option>
                    <option value="short">Short</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Segment</label>
                  <select
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  >
                    {segments.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Media */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Media</h3>
            
            {/* Upload Method Toggle */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setUploadMethod('url')}
                className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition ${
                  uploadMethod === 'url'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Link2 size={16} /> Video URL
              </button>
              <button
                type="button"
                onClick={() => setUploadMethod('file')}
                className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition ${
                  uploadMethod === 'file'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <UploadIcon size={16} /> Upload File
              </button>
            </div>

            {/* URL Method */}
            {uploadMethod === 'url' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Video URL *</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or direct MP4 link"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                    required={uploadMethod === 'url'}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">YouTube</span>
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">Vimeo</span>
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">Google Drive</span>
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">Direct MP4</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Thumbnail URL (optional)</label>
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://your-thumbnail-image.jpg"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  />
                </div>
              </>
            )}

            {/* File Method */}
            {uploadMethod === 'file' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Video File *</label>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                    required={uploadMethod === 'file'}
                  />
                  {videoFile && (
                    <p className="text-xs text-gray-400 mt-1">
                      📹 {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Max file size: 100MB (for larger files, use URL method)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Thumbnail Image (optional)</label>
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailFileChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                  />
                  {thumbnailFile && (
                    <p className="text-xs text-gray-400 mt-1">
                      🖼️ {thumbnailFile.name}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Section: Publishing */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Publishing</h3>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-400 flex items-start gap-2">
              <Info size={16} className="flex-shrink-0 mt-0.5" />
              <p>Video will be published immediately. You can edit or unpublish later.</p>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-bold text-lg transition disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  )
}