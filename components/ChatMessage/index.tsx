import * as React from 'react';
import styled from 'styled-components';

const MessageBox = styled.div`
  max-width: 70%;
  flex-grow: 0;
`;

const Message = styled.span`
  font-weight: 500;
  line-height: 1.4;
  white-space: pre-wrap;
`;

export interface Props {
  position: string,
  message: string,
}

const ChatMessage = (props:Props) => {
  const { position = 'left', message } = props;
  const isRight = position.toLowerCase() === 'right';
  const align = isRight ? 'text-right': 'text-left';
  const justify = isRight ? 'justify-content-end' : 'justify-content-start';

  return (
    <div className={`w-100 my-1 d-flex ${justify}`}>
      <MessageBox className={`bg-light rounded border border-gray p-2`}>
        <Message className={`d-block text-secondary ${align}`}>
          {message}
        </Message>
      </MessageBox>    
    </div>
  )
}

export default ChatMessage;