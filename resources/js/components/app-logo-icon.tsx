import { ImgHTMLAttributes } from "react";

export default function AppLogoIcon(
    props: React.ImgHTMLAttributes<HTMLImageElement>
) {
    return (
      <div className="flex items-center gap-3">
    <img
        src="/storage/pms_logo1.png"
        alt="PMS Logo"
        className="h-12 w-auto object-contain"
    />
   
</div>

    );
}

