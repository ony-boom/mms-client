import { Howl } from "howler";

export const useNewPlayList = ({ src }: UsePlayListParams) => {
  return new Howl({
    src,
  });
};

export type UsePlayListParams = {
  src: string[];
};
