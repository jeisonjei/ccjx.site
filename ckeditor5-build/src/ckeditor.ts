/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Bold, Code, Italic, Strikethrough, Subscript, Superscript, Underline } from '@ckeditor/ckeditor5-basic-styles';
import { Autoformat } from "@ckeditor/ckeditor5-autoformat";
import Math from '@isaul32/ckeditor5-math/src/math';
import AutoformatMath from '@isaul32/ckeditor5-math/src/autoformatmath';
import { Table, TableToolbar, TableColumnResize,TableProperties,TableCaption } from "@ckeditor/ckeditor5-table";
import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CodeBlock } from "@ckeditor/ckeditor5-code-block";
import { Font } from '@ckeditor/ckeditor5-font';
import { Heading } from "@ckeditor/ckeditor5-heading";
import { Highlight } from '@ckeditor/ckeditor5-highlight';
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line';
import { Image, ImageCaption, ImageResize, ImageStyle, ImageToolbar, ImageUpload, AutoImage } from '@ckeditor/ckeditor5-image';
import { Base64UploadAdapter } from '@ckeditor/ckeditor5-upload';
import { AutoLink, Link } from '@ckeditor/ckeditor5-link';
import { Markdown } from '@ckeditor/ckeditor5-markdown-gfm';
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';
import { List } from '@ckeditor/ckeditor5-list';
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import { SpecialCharacters } from "@ckeditor/ckeditor5-special-characters";
import { SpecialCharactersEssentials } from "@ckeditor/ckeditor5-special-characters";
import { TodoList } from '@ckeditor/ckeditor5-list';
import FullScreen from '@pikulinpw/ckeditor5-fullscreen';

// You can read more about extending the build with additional plugins in the "Installing plugins" guide.
// See https://ckeditor.com/docs/ckeditor5/latest/installation/plugins/installing-plugins.html for details.

class Editor extends ClassicEditor {
	public static override builtinPlugins = [Base64UploadAdapter, Autoformat, Essentials, Paragraph, Font, Bold, Bold, Code, BlockQuote, Italic, Strikethrough, Subscript, Superscript, Underline, Math, AutoformatMath, Table, TableToolbar,TableColumnResize,TableProperties, Alignment, CodeBlock, Heading, Highlight, HorizontalLine, Image, ImageToolbar, ImageCaption, ImageStyle, ImageResize,ImageUpload,AutoImage,AutoLink,Link,SourceEditing, List,RemoveFormat,PasteFromOffice,SpecialCharacters,SpecialCharactersEssentials,TodoList,FullScreen,TableCaption];

	public static override defaultConfig = {
		toolbar: {
			items: ['heading','bulletedList', 'numberedList','todoList', '|', 'fontFamily', 'fontColor', 'highlight', '|', 'alignment', '|', 'bold', 'italic', 'underline', 'strikethrough', 'code', 'codeBlock', 'blockQuote', 'subscript', 'superscript', '|', 'math','specialCharacters', '|', 'insertTable', 'horizontalLine', 'imageUpload','link','|','removeFormat','|','sourceEditing','fullScreen'],
			shouldNotGroupWhenFull:true
		},
		
		language: 'en',
		image: {
            toolbar: [
                'imageStyle:block',
                'imageStyle:side',
                'imageStyle:inline',
                'imageStyle:alignLeft',
                'imageStyle:alignRight',
                'imageStyle:alignCenter',
                '|',
                'toggleImageCaption',
                'imageTextAlternative'
            ]
        },
		table: {
            contentToolbar: ['toggleTableCaption','tableColumn', 'tableRow', 'mergeTableCells','tableProperties']
		},
		math: {
			engine: 'katex', // or katex or function. E.g. (equation, element, display) => { ... }
			lazyLoad: undefined, // async () => { ... }, called once before rendering first equation if engine doesn't exist. After resolving promise, plugin renders equations.
			outputType: 'script', // or span
			className: 'math-tex', // class name to use with span output type, change e.g. MathJax processClass (v2) / processHtmlClass (v3) is set
			forceOutputType: false, // forces output to use outputType
			enablePreview: true, // Enable preview view
			previewClassName: [], // Class names to add to previews
			popupClassName: [], // Class names to add to math popup balloon
			katexRenderOptions: {}  // KaTeX only options for katex.render(ToString)
		},
		link: {
			// Automatically add target="_blank" and rel="noopener noreferrer" to all external links.
			addTargetToExternalLinks: true,
		}
	};
}

export default Editor;
