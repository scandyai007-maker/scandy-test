import React, { useState, useEffect } from 'react';
import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, IEditorConfig } from '@wangeditor/editor';
import { supabase } from '../../lib/supabase';
import { message } from 'antd';

interface RichTextEditorProps {
    value?: string;
    onChange?: (html: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
    const [editor, setEditor] = useState<IDomEditor | null>(null);
    const [html, setHtml] = useState(value || '');

    useEffect(() => {
        if (value === undefined) return;
        if (editor && editor.getHtml() !== value) {
            setHtml(value);
        }
    }, [value, editor]);

    const editorConfig: Partial<IEditorConfig> = {
        placeholder: 'Type your rich content here...',
        MENU_CONF: {
            uploadImage: {
                async customUpload(file: File, insertFn: any) {
                    try {
                        message.loading({ content: 'Uploading image...', key: 'uploading' });
                        const fileExt = file.name.split('.').pop();
                        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                        
                        const { error: uploadError } = await supabase.storage
                            .from('images')
                            .upload(fileName, file);

                        if (uploadError) throw uploadError;

                        const { data } = supabase.storage.from('images').getPublicUrl(fileName);
                        
                        message.success({ content: 'Image uploaded successfully!', key: 'uploading' });
                        insertFn(data.publicUrl, file.name, data.publicUrl);
                    } catch (error) {
                        message.error({ content: 'Image upload failed!', key: 'uploading' });
                        console.error('Image upload failed:', error);
                    }
                }
            }
        }
    };

    useEffect(() => {
        return () => {
            if (editor == null) return;
            editor.destroy();
            setEditor(null);
        };
    }, [editor]);

    return (
        <div style={{ border: '1px solid #d9d9d9', borderRadius: '8px', overflow: 'hidden', zIndex: 100, backgroundColor: 'white' }}>
            <Toolbar
                editor={editor}
                defaultConfig={{}}
                mode="default"
                style={{ borderBottom: '1px solid #d9d9d9', backgroundColor: '#fafafa' }}
            />
            <Editor
                defaultConfig={editorConfig}
                value={html}
                onCreated={setEditor}
                onChange={editor => {
                    const content = editor.getHtml();
                    setHtml(content);
                    if (onChange) onChange(content);
                }}
                mode="default"
                style={{ height: '350px', overflowY: 'hidden' }}
            />
        </div>
    );
};
