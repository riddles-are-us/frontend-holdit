import TitaniumIcon from "../../games/images/Icons/Titanium.png";
import TitaniumDisabledIcon from "../../games/images/Icons/TitaniumDisabled.png";

export enum ResourceType {
  Titanium,
}

export interface ResourceAmountPair {
  type: ResourceType;
  amount: number;
}

interface ResourceData {
  name: string;
  description: string;
  iconPath: string;
  disableIconPath: string;
}

const resourceDatas: Record<ResourceType, ResourceData> = {
  [ResourceType.Titanium]: {
    name: "Titanium",
    description: "This is Titanium",
    iconPath: TitaniumIcon,
    disableIconPath: TitaniumDisabledIcon,
  },
};

export const resourceTypes = Object.values(ResourceType).filter(
  (value) => typeof value === "number"
) as ResourceType[];

export const emptyResources = {
  type: resourceTypes[0],
  amount: 0,
};

export function getResources(balance: number) {
  return {
    type: resourceTypes[0],
    amount: balance,
  };
}

export function getResourceIconPath(type: ResourceType): string {
  return resourceDatas[type].iconPath;
}

export function getResourceDisabledIconPath(type: ResourceType): string {
  return resourceDatas[type].disableIconPath;
}

export function getNumberAbbr(num: number): string {
  const abbr = [
    { value: 1e12, suffix: "T" },
    { value: 1e9, suffix: "B" },
    { value: 1e6, suffix: "M" },
    { value: 1e3, suffix: "K" },
  ];
  const sign = num < 0 ? "-" : "";

  num = Math.abs(num);
  for (let i = 0; i < abbr.length; i++) {
    if (num >= abbr[i].value) {
      let formattedNumber = (num / abbr[i].value).toFixed(1);
      if (formattedNumber.endsWith(".0")) {
        formattedNumber = formattedNumber.slice(0, -2);
      }
      return sign + formattedNumber + abbr[i].suffix;
    }
  }

  return sign + num.toString();
}

export interface ConfirmPopupInfo {
  title: string;
  description: string;
  isError: boolean;
}

export const emptyConfirmPopupInfo: ConfirmPopupInfo = {
  title: "",
  description: "",
  isError: false,
};