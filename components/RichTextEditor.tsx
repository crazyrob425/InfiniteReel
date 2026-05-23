'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useEditor, EditorContent, ReactRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Mention from '@tiptap/extension-mention';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import { SUGGESTIONS, SuggestionItem } from '@/lib/suggestions';
import { Sparkles, Bold, Italic, List, Hash, Quote } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'Start writing your prompt...',
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'bg-indigo-100 text-indigo-700 px-1 rounded-md font-medium border border-indigo-200',
        },
        suggestion: {
          items: ({ query }) => {
            return SUGGESTIONS.filter(item =>
              item.label.toLowerCase().startsWith(query.toLowerCase())
            ).slice(0, 5);
          },
          render: () => {
            let component: ReactRenderer;
            let popup: TippyInstance[];

            return {
              onStart: props => {
                component = new ReactRenderer(SuggestionList, {
                  props,
                  editor: props.editor,
                });

                if (!props.clientRect) {
                  return;
                }

                popup = tippy('body', {
                  getReferenceClientRect: props.clientRect as any,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: 'manual',
                  placement: 'bottom-start',
                });
              },

              onUpdate(props) {
                component.updateProps(props);

                if (!props.clientRect) {
                  return;
                }

                popup[0].setProps({
                  getReferenceClientRect: props.clientRect as any,
                });
              },

              onKeyDown(props) {
                if (props.event.key === 'Escape') {
                  popup[0].hide();
                  return true;
                }

                return (component?.ref as any)?.onKeyDown(props);
              },

              onExit() {
                popup[0].destroy();
                component.destroy();
              },
            };
          },
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      // Tiptap works with HTML internally, but for the prompt we might want plain text or markdown
      // For simplicity, we'll strip HTML tags to get plain text, or keep it if the backend supports it.
      // The current backend likely expects a string.
      onChange(editor.getText());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none max-w-none min-h-[160px] p-4',
      },
    },
  });

  // Sync content from outside if it changes (e.g. from state)
  useEffect(() => {
    if (editor && content !== editor.getText()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-100 p-2 flex items-center gap-1">
        <ToolbarButton 
          active={editor.isActive('bold')} 
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={<Bold className="w-4 h-4" />}
          label="Bold"
        />
        <ToolbarButton 
          active={editor.isActive('italic')} 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={<Italic className="w-4 h-4" />}
          label="Italic"
        />
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <ToolbarButton 
          active={editor.isActive('heading', { level: 3 })} 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          icon={<Hash className="w-4 h-4" />}
          label="Heading"
        />
        <ToolbarButton 
          active={editor.isActive('bulletList')} 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={<List className="w-4 h-4" />}
          label="Bullet List"
        />
        <ToolbarButton 
          active={editor.isActive('blockquote')} 
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          icon={<Quote className="w-4 h-4" />}
          label="Blockquote"
        />
        <div className="flex-grow" />
        <div className="text-[10px] text-gray-400 font-mono px-2 hidden sm:block">
          Type &apos;@&apos; for suggestions
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`p-1.5 rounded-md transition-colors ${
        active ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
      }`}
    >
      {icon}
    </button>
  );
}

const SuggestionList = React.forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command({ id: item.id, label: item.label });
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  React.useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden py-1 min-w-[200px]">
      {props.items.length > 0 ? (
        props.items.map((item: SuggestionItem, index: number) => (
          <button
            key={item.id}
            onClick={() => selectItem(index)}
            className={`w-full text-left px-3 py-2 flex items-center gap-3 transition-colors ${
              index === selectedIndex ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex-grow">
              <div className="text-sm font-medium">{item.label}</div>
              {item.description && (
                <div className="text-[10px] opacity-70 leading-tight">{item.description}</div>
              )}
            </div>
            <div className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${
              item.type === 'camera' ? 'border-amber-200 bg-amber-50 text-amber-600' :
              item.type === 'mod' ? 'border-blue-200 bg-blue-50 text-blue-600' :
              item.type === 'idea' ? 'border-purple-200 bg-purple-50 text-purple-600' :
              item.type === 'lipsync' ? 'border-pink-200 bg-pink-50 text-pink-600' :
              item.type === 'transition' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' :
              item.type === 'lighting' ? 'border-yellow-200 bg-yellow-50 text-yellow-600' :
              item.type === 'motion' ? 'border-cyan-200 bg-cyan-50 text-cyan-600' :
              item.type === 'vfx' ? 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-600' :
              'border-gray-200 bg-gray-50 text-gray-500'
            }`}>
              {item.type}
            </div>
          </button>
        ))
      ) : (
        <div className="px-3 py-2 text-sm text-gray-400">No results found</div>
      )}
    </div>
  );
});

SuggestionList.displayName = 'SuggestionList';
