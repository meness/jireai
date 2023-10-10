import { IAllProps, Editor as TinyEditor } from '@tinymce/tinymce-react';
import { forwardRef } from 'react';

type EditorProps = Omit<IAllProps, 'tinymceScriptSrc' | 'ref'>;

export const Editor = forwardRef<TinyEditor, EditorProps>(({ init, ...props }, ref) => {
  return (
    <div className="min-h-[500px]">
      <TinyEditor
        tinymceScriptSrc="/assets/js/tinymce/tinymce.min.js"
        init={{
          min_height: 200,
          height: 500,
          max_height: 700,
          menubar: false,
          plugins: 'lists advlist autolink link preview searchreplace fullscreen help wordcount directionality',
          toolbar_mode: 'floating',
          toolbar:
            'undo redo | blocks | bold italic underline strikethrough removeformat | subscript superscript | link | alignleft aligncenter alignright alignjustify | ltr rtl | bullist numlist | outdent indent | fullscreen | preview | searchreplace',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          ...init,
        }}
        {...props}
        ref={ref}
      />
    </div>
  );
});
