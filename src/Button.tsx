import './styles.css';
import { type ButtonHTMLAttributes } from 'react';


type ButtonProps = { children: React.ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = (props: ButtonProps) => {
    return <button {...props}>
        { props.children } 버튼
    </button>
}

export default Button;