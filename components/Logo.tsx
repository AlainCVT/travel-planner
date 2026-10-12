import { clsx } from "cn";
import { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  size?: SVGProps<SVGSVGElement>["width"] | SVGProps<SVGSVGElement>["height"];
};

export default function Logo({ className, size = 24, ...props }: Props) {
  return (
    <svg
      className={clsx("inline", className)}
      {...props}
      viewBox="0 0 360 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...{ ...(size && { width: size, height: size }) }}
    >
      <path
        d="M215.748 266.456C278.542 271.672 325 290.308 325 312.5C325 338.734 260.081 360 180 360C99.9187 360 35 338.734 35 312.5C35 290.308 81.4575 271.672 144.251 266.456C163.868 297.414 180 320 180 320C180 320 196.131 297.414 215.748 266.456Z"
        fill="currentColor"
      />
      <path
        d="M285 115C285 172.99 180 320 180 320C180 320 75 172.99 75 115C75 57.0101 122.01 10 180 10C237.99 10 285 57.0101 285 115Z"
        stroke="currentColor"
        strokeWidth="15"
      />
      <circle cx="180" cy="115" r="50" stroke="currentColor" strokeWidth="15" />
    </svg>
  );
}
