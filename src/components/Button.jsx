import { Link } from 'react-router-dom'

const Button = ({to,text,style,...props}) => {

    const defaultClasses = "font-medium bg-(--color-primary) text-(--color-text) text-center py-2 px-4 rounded-[10px] hover:bg-(--color-secondary)  transition-all";
     const combinedClasses = ` ${style || ''} ${defaultClasses}`;
    if(to){
        return  <Link
          to={to}
          className={combinedClasses}
          {...props}
        >
         {text}
        </Link>
    }
  return (
    <button   className={combinedClasses}
          {...props}>{text}</button>
  )
}

export default Button