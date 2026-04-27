import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { energySummary } from '../../data/mockData';

const data = [
  { name: '照明', value: energySummary.lighting },
  { name: '空调', value: energySummary.cooling },
  { name: '风机', value: energySummary.fan },
  { name: '灌溉', value: energySummary.irrigation },
  { name: '除湿', value: energySummary.dehumidify },
  { name: '网关', value: energySummary.sensorGateway }
];

export function EnergyChart() {
  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -26, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid stroke="rgba(169,255,208,0.08)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#78968c', fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          <YAxis tick={{ fill: '#78968c', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: 'rgba(3,17,17,0.92)',
              border: '1px solid rgba(112,242,161,0.24)',
              borderRadius: 6,
              color: '#eafff5'
            }}
          />
          <Bar dataKey="value" name="kWh" fill="#70f2a1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
