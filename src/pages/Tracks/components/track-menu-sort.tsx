import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrackSortField } from "@/api";
import { SelectProps } from "@radix-ui/react-select";

export const TrackMenuSort = (props: SelectProps) => {
  return (
    <Select {...props}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={TrackSortField.TITLE}>Title</SelectItem>
          <SelectItem value={TrackSortField.ALBUM_TITLE}>Album</SelectItem>
          <SelectItem value={TrackSortField.DATE_ADDED}>
            Date added
          </SelectItem>
          <SelectItem value={null!}>None</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export type TrackMenuSortProps = SelectProps;
