import './lazyButton.css';
import { type ButtonHTMLAttributes } from 'react';

type LazyButtonProps = { children: React.ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>;

const LazyButton = (props: LazyButtonProps) => {
  return (
    <button className="lazyButton" {...props}>
      {props.children} 버튼
    </button>
  );
};

export default LazyButton;
