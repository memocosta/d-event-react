import React, { useEffect, useState } from "react";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Form } from "semantic-ui-react";

const EditorShared = ({ title, data, setData }) => {
  const contentState = ContentState.createFromText(data);
  const editorState = EditorState.createWithContent(contentState);
  const [desc, setDesc] = useState(editorState);

  useEffect(() => {
    let isMounted = true
    if (!isMounted || !data || data === '') return
    // const blocks = convertFromHTML(data)
    // const content = ContentState.createFromBlockArray(
    //   blocks.contentBlocks,
    //   blocks.entityMap
    // )
    console.log(data);

    // setDesc(data)
    return () => {
      isMounted = false
    }
  }, [data])

  return (
    <>
      <Form.Group>
        <Form.Field style={{maxWidth: "100%"}}>
          <p style={{ color: "rgb(180 190 239)" }}>{title}</p>
          <Editor
            editorState={desc}
            toolbarClassName="toolbar"
            wrapperClassName="ticketArea"
            editorClassName="editor"
            onEditorStateChange={(editorState) => {
              setDesc(editorState);

              const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
              const value = blocks.map(block => (!block.text && '\n') || block.text).join('\n');
              // console.log(value);

              setData(value);
            }}
          />
        </Form.Field>
      </Form.Group>
    </>
  );
};

export default EditorShared;
