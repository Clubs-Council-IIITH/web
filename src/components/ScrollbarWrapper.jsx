import { Scrollbars } from "react-custom-scrollbars-2";

export default function ScrollbarWrapper({ children }) {
  return (
    <Scrollbars autoHide universal={true} style={{ height: "100vh" }}>
      {children}
    </Scrollbars>
  );
}
