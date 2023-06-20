import { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';

import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import sanitizeHtml from 'sanitize-html';

import { useMode } from 'contexts/ModeContext';

export default function TextEditor({
    editormdState: [text, setText] = ["", null],
    editorhtmlState: [htmlcode, setHtmlcode], editing = true
}) {
    const { isLight } = useMode();
    const editorRef = useRef();
    const [footer, setFooter] = useState([]);

    editorRef.current?.on('preview', (status) => {
        if (status)
            setFooter(['=', 'scrollSwitch']);
        else
            setFooter([]);
    });

    return (
        <>
            {editing && setText ?
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
                <Box>
                    <div dangerouslySetInnerHTML={{ __html: htmlcode || "<p>No Description Provided.<p>" }} />
                </Box>
            }
        </>
    );
};

