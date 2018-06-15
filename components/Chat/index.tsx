import * as React from 'react';
import { Component, Fragment } from 'react';
import axios from 'axios';
import * as Pusher from 'pusher-js';
import styled from 'styled-components';
import ChatMessage from '../ChatMessage';

const SAD_EMOJI = [55357, 56864];
const HAPPY_EMOJI = [55357, 56832];
const NEUTRAL_EMOJI = [55357, 56848];

const ChatHeader = styled.div`
  height: 90px;
`;

const ChatBody = styled.div`
  height: calc(100% - 180px);
  overflow-y: scroll;
`;

const ChatMessageBox = styled.div`
  min-height: 90px;
  & textarea {
    resize: none;
  }
`;

export interface ChatMessage {
  user: string
  message: string 
  timestamp: number
  sentiment: number
}

export interface NewMessage {
  chat: ChatMessage
}
export interface State {
  chats: ChatMessage[]
}

declare var process: {
  env: {
    PUSHER_APP_CLUSTER: string,
    PUSHER_APP_KEY: string,
  }
}

class Chat extends Component<any, State> {
  pusher: Pusher.Pusher;
  channel: Pusher.Channel;
  scrollBottom: React.RefObject<HTMLDivElement>;

  constructor(props:any) {
    super(props);
    this.state = { chats: [] };
    this.scrollBottom = React.createRef();
  }
  

  componentDidMount() {
    this.pusher = new Pusher(
      process.env.PUSHER_APP_KEY,
      {
        cluster: process.env.PUSHER_APP_CLUSTER,
        encrypted: true
      }
    );
 
    // subscribe to chatroom
    this.channel = this.pusher.subscribe('chat-room');

    // When new message is published, push that into the chat log
    this.channel.bind('new-message', ({ chat = null }: NewMessage) => {
      const { chats } = this.state;
      chat && this.setState({ chats:chats.concat(chat) });
    });

    // When connected, retrieve the chatlog from axios and set messages.
    // axios is an another way to fetch with HTTP request
    this.pusher.connection.bind('connected', () => {
      axios.post('/messages')
      .then(response => {
        const chats = response.data.messages;
        this.setState({ chats });
      });
    });
  }
  componentWillUnmount() {
    this.pusher.disconnect();
  }

  /*
  componentWillUpdate(nextProps: any, nextState: State) {
    const updated = this.state.chats.length !== nextState.chats.length;
    if(updated) {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    this.scrollBottom.current.scrollIntoView({ behavior: "smooth" });
  }
*/
  handleKeyUp = (evt:any) => {
    const value = evt.target.value;

    if (evt.keyCode === 13 && !evt.shiftKey) {
      const { activeUser: user } = this.props;
      const chat = { 
        user, 
        message: value, 
        timestamp: +new Date
      };
      evt.target.value = '';
      axios.post('/message', chat);
    }
  }

  render() {
    const { activeUser } = this.props
    const { chats } = this.state;
    
    return (
      activeUser && 
      <>
        <ChatHeader className="border-bottom border-gray w-100 d-flex align-items center bg-white">
          <h2 className="text-dark mb-0 mx-4 px-2">
            {activeUser}
          </h2>
        </ChatHeader>
        <ChatBody
          className="px-4 pb-4 w-100 d-flex flex-row flex-wrap align-items-start align-content-start position-relative"
        >
          {chats.map((chat, index) => {
            const previous = Math.max(0, index-1);
            const previousChat = chats[previous];
            const position = chat.user === this.props.activeUser ? "right" : "left";
            const isFirst = previous === index;
            const inSequence = chat.user === previousChat.user;
            const hasDelay = Math.ceil((chat.timestamp - previousChat.timestamp) / (1000 * 60)) > 1;
            const mood = chat.sentiment > 0 ? HAPPY_EMOJI : 
            (chat.sentiment === 0 ? NEUTRAL_EMOJI : SAD_EMOJI);

            return (
              <Fragment key={index}>
                { (isFirst || !inSequence || hasDelay) && (
                  <div className={`d-block w-100 font-weight-bold text-dark mt-4 pb-1 px-1 text-${position}`} style={{ fontSize: '0.9rem' }}>
                    <span className="d-block" style={{ fontSize: '1.6rem' }}>
                      {String.fromCodePoint(...mood)}
                    </span>
                    <span>{chat.user || 'Anonymous'}</span>
                  </div>
            ) }
            
            <ChatMessage message={chat.message} position={position} />
              </Fragment>
            )
          })}
          <div style={{ float:"left", clear: "both" }} ref={this.scrollBottom} />
        </ChatBody>
        <ChatMessageBox className="border-top border-gray w-100 px-4 d-flex align-items-center bg-light">
          <textarea 
            className="form-control px-3 py-2"
            onKeyUp={this.handleKeyUp}
            placeholder="Enter a chat message"
            ></textarea>
        </ChatMessageBox> 
      </>
    )
  }

}

export default Chat;