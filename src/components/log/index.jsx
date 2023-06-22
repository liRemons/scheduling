import React, { useRef, useEffect } from 'react';
import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";

const View = () => {
  const edContainer = useRef();

  useEffect(() => {
    const view = new EditorView({
      doc: "hello world!\nsdfsdf", // 带有 `\n` <img src="会渲染成两行" alt="" width="70%" />
      parent: edContainer.current,
      extensions: [basicSetup]
    });

    return () => {
      view.destroy(); // 注意：此后此处要随组件销毁
    };
  }, []);
  return <div ref={edContainer} className="container"></div>;
}

export default View;