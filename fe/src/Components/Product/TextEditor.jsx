import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../styles/editor.css';
import { stateFromHTML } from 'draft-js-import-html';

class TextEditor extends Component {
    constructor(props) {
        super(props);
        // const html = this.props?.content ?? '';
        // const contentBlock = htmlToDraft(html);
        // this.state = {
        //     editorState: null
        // }
        // if (contentBlock) {
        //     const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        //     const editorState = EditorState.createWithContent(contentState);
        //     this.setState({editorState: editorState});
        // } else {
        //     this.setState({editorState: EditorState.createEmpty()});
        // }

        var contentState = stateFromHTML(this.props?.content);
        var editorState = EditorState.createWithContent(contentState);
        this.state = {editorState: editorState};
    }

    onEditorStateChange = (editorState_) => {
        this.setState({
            editorState:editorState_,
        });
        
        this.props.onChange(draftToHtml(convertToRaw(editorState_.getCurrentContent())))
    };

    render() {
        return (
            <div>
                <Editor
                    editorState={this.state.editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={
                        {
                            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'link', 'emoji', 'remove', 'history']
                        }
                    }
                />
            </div>
        );
    }
}

export default TextEditor