import { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';

import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import sanitizeHtml from 'sanitize-html';

import { useMode } from 'contexts/ModeContext';

export default function TextEditor({ editorState: [description, setDescription], editing = true }) {
    const { isLight } = useMode();
    const editorRef = useRef();
    const [footer, setFooter] = useState([]);

    // TODO: Re-Solve Circular Dependency
    // One solution is to add a count and run first useEffect only 10 times or so

    const [text, setText] = useState(description?.md || '');
    const [htmlcode, setHtmlcode] = useState(description?.htmlcode || '');
    const [updateCount, setUpdateCount] = useState(0);
    const descriptionRef = useRef('');
    descriptionRef.current = description;

    useEffect(() => {
        if (description && updateCount < 11) {
            setText(descriptionRef.current?.md || '');
            setHtmlcode(descriptionRef.current?.html || '');
            setUpdateCount(updateCount + 1);
        }
    }, [description]);

    useEffect(() => {
        if (editing) {
            setDescription({
                md: text,
                html: htmlcode,
            });
        }
    }, [editing, text, htmlcode]);

    editorRef.current?.on('preview', (status) => {
        if (status)
            setFooter(['=', 'scrollSwitch']);
        else
            setFooter([]);
    });

    return (
        <>
            {editing ?
                <MdEditor
                    theme={isLight ? 'light' : 'dark'}
                    modelValue={text}
                    onChange={setText}
                    sanitize={(html) => sanitizeHtml(html)}
                    ref={editorRef}
                    onHtmlChanged={(html) => setHtmlcode(html)}
                    language="en-US"
                    previewTheme='github'
                    noUploadImg={true}
                    placeholder="Markdown Field"
                    toolbarsExclude={['codeRow', 'code', 'save', 'pageFullscreen', 'fullscreen',
                        'htmlPreview', 'github', 'catalog', "="]} // "image", 
                    footers={footer}
                    preview={false}
                /> :
                // null
                <Box>
                    <div dangerouslySetInnerHTML={{ __html: htmlcode || "<p>No Description Provided.<p>" }} />
                </Box>
            }
        </>
    );
};

