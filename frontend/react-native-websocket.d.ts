declare module 'react-native-websocket' {
    import { Component } from 'react';
  
    interface WebSocketProps {
      url: string;
      onOpen?: (event: any) => void;
      onClose?: (event: any) => void;
      onMessage?: (event: any) => void;
      onError?: (event: any) => void;
    }
  
    export default class WebSocket extends Component<WebSocketProps> {}
  }
  