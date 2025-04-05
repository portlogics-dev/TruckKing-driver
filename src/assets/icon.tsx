import {
  GhostIcon,
  KeyRoundIcon,
  HouseIcon,
  TruckIcon,
  UserIcon,
  CameraIcon,
  PhoneIcon,
  RotateCcwIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ZapIcon,
  ZapOffIcon,
  MoonIcon,
  SunMoonIcon,
  CircleXIcon,
  DownloadIcon,
  CircleCheckIcon,
  LucideIcon,
  CircleIcon,
  ImageIcon,
  XIcon,
  SendIcon,
} from "lucide-react-native";
import { cssInterop } from "react-native-css-interop";

export function iconWithClassName(icon: LucideIcon) {
  cssInterop(icon, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
}

iconWithClassName(GhostIcon);
iconWithClassName(KeyRoundIcon);
iconWithClassName(HouseIcon);
iconWithClassName(TruckIcon);
iconWithClassName(UserIcon);
iconWithClassName(CameraIcon);
iconWithClassName(PhoneIcon);
iconWithClassName(RotateCcwIcon);
iconWithClassName(CheckIcon);
iconWithClassName(ChevronDownIcon);
iconWithClassName(ChevronUpIcon);
iconWithClassName(ZapIcon);
iconWithClassName(ZapOffIcon);
iconWithClassName(MoonIcon);
iconWithClassName(SunMoonIcon);
iconWithClassName(CircleXIcon);
iconWithClassName(DownloadIcon);
iconWithClassName(CircleCheckIcon);
iconWithClassName(CircleIcon);
iconWithClassName(ImageIcon);
iconWithClassName(XIcon);
iconWithClassName(SendIcon);

export {
  GhostIcon,
  KeyRoundIcon,
  HouseIcon,
  TruckIcon,
  UserIcon,
  CameraIcon,
  PhoneIcon,
  RotateCcwIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ZapIcon,
  ZapOffIcon,
  MoonIcon,
  SunMoonIcon,
  CircleXIcon,
  DownloadIcon,
  CircleCheckIcon,
  CircleIcon,
  ImageIcon,
  XIcon,
  SendIcon,
};
