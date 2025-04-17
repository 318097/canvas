import React from "react";
import { Button, Segmented, Select, Input } from "antd";
import { POST_VARIANTS } from "../config";
import { generateTemplate } from "../helpers";
import {
  ColumnHeightOutlined,
  ColumnWidthOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  resetState,
  setFilename,
  setPostVariant,
  setSelectedTemplates,
  setView,
  setZoomLevel,
} from "../store";

const Mainbar = ({ handleDownload }) => {
  const { selectedTemplates, postVariant, zoomLevel, view, filename } =
    useSelector((state) => state.sdata);
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col gap-2 bg-gray-100 border border-l-gray-300 p-2 w-[280px] shrink-0 h-full overflow-auto">
      <h3 className="text-gray-400 font-bold py-3">Canvas</h3>
      <hr />
      <div className="flex flex-col items-stretch gap-2 grow">
        <div className="flex flex-col items-start gap-1 mb-2">
          <label className="text-xs font-bold">Platforms</label>
          <Select
            mode="multiple"
            className="w-full"
            options={generateTemplate("all").map(({ platform }) => ({
              label: platform,
              value: platform,
            }))}
            value={selectedTemplates}
            onChange={(value) => {
              dispatch(setSelectedTemplates(value));
            }}
          />
        </div>

        <div className="flex flex-col items-start gap-1 mb-2">
          <label className="text-xs font-bold">Variant</label>
          <Select
            placeholder="Variant"
            // className="w-full"
            options={POST_VARIANTS}
            value={postVariant}
            onChange={(variant) => dispatch(setPostVariant(variant))}
          />
        </div>

        <div className="flex flex-col items-start gap-1 mb-2">
          <label className="text-xs font-bold">View</label>
          <Segmented
            onChange={(view) => dispatch(setView(view))}
            value={view}
            options={[
              { value: "col", icon: <ColumnHeightOutlined /> },
              { value: "row", icon: <ColumnWidthOutlined /> },
            ]}
          />
        </div>

        <div className="flex flex-col items-start gap-1 mb-2">
          <label className="text-xs font-bold">Zoom</label>
          <div className="flex items-center gap-2">
            <Button
              icon={<MinusOutlined />}
              onClick={() => dispatch(setZoomLevel("-"))}
            />
            <span className="font-bold text-sm">{zoomLevel}</span>
            <Button
              icon={<PlusOutlined />}
              onClick={() => dispatch(setZoomLevel("+"))}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end flex-col gap-2">
        <Input
          placeholder="Filename"
          value={filename}
          onChange={(e) => dispatch(setFilename(e.target.value))}
        />
        <div className="flex gap-2">
          <Button className="grow" onClick={() => dispatch(resetState())}>
            Reset State
          </Button>
          <Button className="grow" type="primary" onClick={handleDownload}>
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Mainbar;
