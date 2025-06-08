//app\_components\Editor.jsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import React, { useState } from 'react'

const MenuBar = ({ editor, preview, setPreview }) => {
  if (!editor) return null

  const buttonStyle = 'p-2 sm:px-3 sm:py-1.5 hover:bg-gray-200 active:bg-gray-300 rounded text-sm sm:text-base transition-colors min-w-[40px] sm:min-w-0'
  const activeButtonStyle = 'bg-gray-200'

  return (
    <div className="flex items-center flex-wrap gap-1 sm:gap-2 px-2 sm:px-3 py-2 sm:py-1.5 bg-gray-50 border-t border-gray-300">
      {/* Undo/Redo */}
      <div className="flex gap-1">
        <button 
          onClick={() => editor.chain().focus().undo().run()} 
          className={buttonStyle}
          aria-label="Undo"
        >
          ↶
        </button>
        <button 
          onClick={() => editor.chain().focus().redo().run()} 
          className={buttonStyle}
          aria-label="Redo"
        >
          ↷
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 hidden sm:block" />

      {/* Font Family - Hidden on mobile, shown on tablet+ */}
      <select
        onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
        className="border rounded px-2 py-1 text-xs sm:text-sm hidden sm:block"
        defaultValue="sans-serif"
      >
        <option value="sans-serif">Sans Serif</option>
        <option value="serif">Serif</option>
        <option value="monospace">Monospace</option>
      </select>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 hidden sm:block" />

      {/* Text Formatting */}
      <div className="flex gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${buttonStyle} ${editor.isActive('bold') ? activeButtonStyle : ''} font-bold`}
          aria-label="Bold"
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${buttonStyle} ${editor.isActive('italic') ? activeButtonStyle : ''} italic`}
          aria-label="Italic"
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`${buttonStyle} ${editor.isActive('underline') ? activeButtonStyle : ''} underline`}
          aria-label="Underline"
        >
          U
        </button>
      </div>

      {/* Preview Toggle - Right aligned */}
      <button
        onClick={() => setPreview(prev => !prev)}
        className={`${buttonStyle} ml-auto bg-indigo-100 hover:bg-indigo-200 text-indigo-700`}
      >
        {preview ? 'Edit' : 'Preview'}
      </button>
    </div>
  )
}

const Editor = ({ content, setContent, minHeight = "200px", maxHeight = "400px" }) => {
  const [preview, setPreview] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily.configure({ types: ['textStyle'] }),
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none px-3 sm:px-4 py-2 sm:py-3',
      },
    },
  })

  return (
    <div className={`w-full border rounded-lg shadow-sm bg-white flex flex-col overflow-hidden transition-all duration-200 ${
      isFocused ? 'border-indigo-500 shadow-md' : 'border-gray-300'
    }`}>
      {/* Editor Content Area */}
      <div 
        className="flex-1 overflow-y-auto"
        style={{ 
          minHeight: window.innerWidth < 640 ? '150px' : minHeight,
          maxHeight: window.innerWidth < 640 ? '300px' : maxHeight 
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {preview ? (
          <div
            className="prose prose-sm sm:prose-base px-3 sm:px-4 py-2 sm:py-3"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>

      {/* Toolbar */}
      <MenuBar editor={editor} preview={preview} setPreview={setPreview} />
    </div>
  )
}

// Mobile-optimized variant
export const MobileEditor = ({ content, setContent }) => {
  const [showToolbar, setShowToolbar] = useState(false)
  
  return (
    <div className="relative w-full">
      <Editor content={content} setContent={setContent} />
      
      {/* Mobile-only: Floating toolbar toggle */}
      <button
        onClick={() => setShowToolbar(!showToolbar)}
        className="sm:hidden fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg z-10"
        aria-label="Toggle toolbar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </button>
    </div>
  )
}

export default Editor