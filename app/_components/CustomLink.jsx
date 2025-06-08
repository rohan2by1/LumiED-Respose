//app\_components\CustomLink.jsx
import Link from "next/link"

const CustomLink = (props) => {
    return (
        <Link
            href={props?.href || "#"}
            prefetch={props?.prefetch || false}
            className={props?.className || ""}
            target={props?.target || "_self"}
            rel={props?.rel || "noopener noreferrer"}
            {...props}
        >
            {props?.children}
        </Link>
    )
}

export default CustomLink;
