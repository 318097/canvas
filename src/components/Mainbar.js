import React from "react";
import {
  Button,
  Segmented,
  Select,
  Input,
  Card,
  Popconfirm,
  Statistic,
  Tooltip,
  Avatar,
  Popover,
  Tag,
  Carousel,
} from "antd";
import config, { POST_VARIANTS } from "../config";
import { generateTemplate } from "../helpers";
import {
  ColumnHeightOutlined,
  ColumnWidthOutlined,
  LogoutOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  resetState,
  setFilename,
  setPostVariant,
  setSelectedTemplates,
  setView,
  setZoomLevel,
} from "../store";

const Mainbar = ({ handleDownload }) => {
  const {
    selectedTemplates,
    postVariant,
    zoomLevel,
    view,
    filename,
    exportId,
    totalExports,
    userPhoto,
    userId,
    userName,
    userEmail,
  } = useSelector((state) => state.sdata);
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col gap-2 bg-gray-50 border border-r-gray-200 p-2 w-[280px] shrink-0 h-full overflow-auto">
      <div className="py-3 flex items-start justify-between">
        <div>
          <h3 className="text-gray-600 font-bold truncate">{config.appName}</h3>
          <p className="text-xs text-gray-400 truncate whitespace-break-spaces">
            {config.tagline}
          </p>
        </div>
        <Popover
          trigger="click"
          placement="bottomRight"
          content={
            <div className="w-36 min-h-8 flex flex-col items-stretch gap-2 overflow-hidden">
              <div className="text-xs text-gray-600 truncate">{userName}</div>
              {!!userEmail && (
                <div className="text-xs text-gray-600">{userEmail}</div>
              )}
              <Tag className="overflow-hidden truncate w-full mt-1">
                {userId}
              </Tag>
              <Button type="primary" danger onClick={() => dispatch(logout())}>
                <LogoutOutlined className="mr-2" />
                Logout
              </Button>
            </div>
          }
        >
          <Avatar
            src={userPhoto}
            style={{
              backgroundColor: "#fde3cf",
              color: "#f56a00",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {userName?.charAt(0)?.toUpperCase()}
          </Avatar>
        </Popover>
      </div>
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
            className="w-full"
            options={POST_VARIANTS}
            value={postVariant}
            onChange={(variant) => dispatch(setPostVariant(variant))}
            optionRender={(option) => {
              return (
                <div className="flex flex-col items-start gap-.5">
                  <div>{option.data.label}</div>
                  <div className="text-xs text-gray-600 break-words whitespace-break-spaces">
                    {option.data.description}
                  </div>
                </div>
              );
            }}
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
        <div>
          <Popconfirm
            title="Sure?"
            placement="right"
            description={
              <div className="max-w-[300px]">
                This will clear templates, properties, filters & data.
              </div>
            }
            onConfirm={() => dispatch(resetState())}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Clear</Button>
          </Popconfirm>
        </div>
      </div>

      <div className="flex justify-end flex-col gap-2">
        <Carousel
          autoplay
          dotPosition="bottom"
          dots={true}
          effect="fade"
          arrows
          autoplaySpeed={7000}
        >
          <Card variant="borderless">
            <Statistic title="Export Id" value={exportId} />
          </Card>
          <Card variant="borderless">
            <Statistic title="Total Exports" value={totalExports} />
          </Card>
        </Carousel>

        <Input
          placeholder="Filename"
          value={filename}
          onChange={(e) => dispatch(setFilename(e.target.value))}
          // addonAfter={<ReloadOutlined onClick={generateFileName} />}
        />
        <div className="flex gap-2">
          <Tooltip
            title={
              <div>
                <div className="text-xs font-bold">Export</div>
                <div className="text-xs text-gray-500">
                  Export the selected templates as a PNG file.
                </div>
              </div>
            }
          >
            <Button className="grow" type="primary" onClick={handleDownload}>
              Export
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Mainbar;
