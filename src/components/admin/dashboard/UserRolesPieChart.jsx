// components/admin/dashboard/UserRolesPieChart.jsx
"use client";
import React, { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Sector,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ✅ Hardcoded colors (no variable)
const COLORS = [
  "#345DA7", 
  "#3B8AC4", 
  "#EFDBCB", 
"  #4BB4DE"
]
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent, 
  } = props
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 10}
        outerRadius={outerRadius + 12}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
        strokeWidth={2}
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill={fill}
        className="font-semibold text-sm"
      >
        {payload.name}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="hsl(var(--muted-foreground))"
        className="text-xs"
      >
        {`${payload.value} (${(percent * 100).toFixed(0)}%)`}
      </text>
    </g>
  );
};

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent, 
  name,
  fill,
}) => {
  const RADIAN = Math.PI / 180;
  const radiusInner = innerRadius + (outerRadius - innerRadius) * 0.5;
  const xInner = cx + radiusInner * Math.cos(-midAngle * RADIAN);
  const yInner = cy + radiusInner * Math.sin(-midAngle * RADIAN);

  const radiusOuter = outerRadius + 25;
  const xOuter = cx + radiusOuter * Math.cos(-midAngle * RADIAN);
  const yOuter = cy + radiusOuter * Math.sin(-midAngle * RADIAN);

  return (
    <>
      <text
        x={xInner}
        y={yInner}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <text
        x={xOuter}
        y={yOuter}
        fill={fill}
        textAnchor="middle"
        dominantBaseline="central"
        className="font-semibold text-[10px]"
      >
        {name}
      </text>
    </>
  );
};

// ✅ FIXED: Calculate percentage manually in tooltip
const CustomTooltip = ({ active, payload, total }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    const percent = total > 0 ? item.value / total : 0;

    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="font-semibold text-card-foreground">{item.name}</p>
        <p className="text-sm text-muted-foreground">
          Value: <span className="font-medium text-foreground">{item.value}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Percentage:{" "}
          <span className="font-medium text-foreground">
            {(percent * 100).toFixed(1)}%
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default function UserRolesPieChart({ data, title = "User Roles" }) {
  const [activeIndex, setActiveIndex] = useState(undefined);

  // ✅ Calculate total for percentage
  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={activeIndex === undefined ? renderCustomLabel : false}
                outerRadius={80}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                style={{ cursor: "pointer" }}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="transition-all duration-300"
                  />
                ))}
              </Pie>
              {/* ✅ Pass total to tooltip */}
              <Tooltip content={<CustomTooltip total={total} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}