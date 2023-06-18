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

    const [text, setText] = useState(description?.md || '');
    const [htmlcode, setHtmlcode] = useState(description?.htmlcode || '');
    useEffect(() => {
        if (description) {
            setText(description?.md || '');
            setHtmlcode(description?.html || '');
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

    // const [text, setText] = useState('');
    // const [htmlcode, setHtmlcode] = useState('');
    // const descriptionRef = useRef(description);

    // useEffect(() => {
    //     let isMounted = true;

    //     if (isMounted) {
    //         setText(description.md || '');
    //         setHtmlcode(description.html || '');
    //     }

    //     return () => {
    //         isMounted = false;
    //     };
    // }, [description]);

    // useEffect(() => {
    //     if (editing) {
    //         setDescription((prevDescription) => {
    //             const updatedDescription = {
    //                 md: prevDescription.md !== text ? text : prevDescription.md,
    //                 html: prevDescription.html !== htmlcode ? htmlcode : prevDescription.html,
    //             };

    //             descriptionRef.current = updatedDescription;
    //             return updatedDescription;
    //         });
    //     }
    // }, [editing, text, htmlcode]);

    // useEffect(() => {
    //     if (!editing) {
    //         setText(descriptionRef.current.md || '');
    //         setHtmlcode(descriptionRef.current.html || '');
    //     }
    // }, [editing]);

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
                    <div dangerouslySetInnerHTML={{ __html: htmlcode }} />
                </Box>
            }
        </>
    );
};

