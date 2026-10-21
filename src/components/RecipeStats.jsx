
import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import {
  VictoryChart,
  VictoryTooltip,
  VictoryBar,
  VictoryAxis,
} from 'victory'

import {
  getTotalViews,
  getDailyViews,
} from '../api/events.js'

export function RecipeStats({ recipeId }) {
  const totalViews = useQuery({
    queryKey: ['totalViews', recipeId],
    queryFn: () => getTotalViews(recipeId),
  })

  const dailyViews = useQuery({
    queryKey: ['dailyViews', recipeId],
    queryFn: () => getDailyViews(recipeId),
  })

  if (totalViews.isLoading || dailyViews.isLoading) {
    return <div>loading stats...</div>
  }

  if (totalViews.isError || dailyViews.isError) {
    return <div>Failed to load recipe statistics.</div>
  }

  const chartData = (dailyViews.data ?? []).map((d) => ({
    x: new Date(d._id),
    y: d.views,
    label: `${new Date(d._id).toLocaleDateString()}: ${d.views} views`,
  }))

  const tickCount = Math.min(chartData.length, 5)

  return (
    <div>
      <b>{totalViews.data?.views} total views</b>

      <div style={{ width: 600, maxWidth: '100%' }}>
        <h3>Daily Views</h3>

        <VictoryChart
          domainPadding={20}
          padding={{
            top: 30,
            bottom: 85,
            left: 55,
            right: 30,
          }}
        >
          <VictoryAxis
            tickCount={tickCount}
            tickFormat={(date) =>
              new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            }
            style={{
              tickLabels: {
                angle: -35,
                fontSize: 10,
                textAnchor: 'end',
                padding: 12,
              },
            }}
          />

          <VictoryAxis
            dependentAxis
            tickFormat={(value) => Math.round(value)}
            style={{
              tickLabels: {
                fontSize: 11,
              },
            }}
          />

          <VictoryBar
            data={chartData}
            labelComponent={<VictoryTooltip />}
            style={{
              data: {
                fill: '#444',
              },
            }}
          />
        </VictoryChart>
      </div>
    </div>
  )
}

RecipeStats.propTypes = {
  recipeId: PropTypes.string.isRequired,
}
