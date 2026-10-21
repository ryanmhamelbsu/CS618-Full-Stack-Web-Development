
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

  const chartData = (dailyViews.data ?? []).map((d, index) => {
    const date = new Date(d._id)

    return {
      x: index + 1,
      y: d.views,
      dateLabel: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      label: `${date.toLocaleDateString()}: ${d.views} views`,
    }
  })

  const tickValues = chartData
    .filter((_, index) => {
      if (chartData.length <= 6) return true

      const interval = Math.ceil(chartData.length / 6)
      return index % interval === 0 ||
        index === chartData.length - 1
    })
    .map((d) => d.x)

  return (
    <div>
      <b>{totalViews.data?.views} total views</b>

      <div style={{ width: 600, maxWidth: '100%' }}>
        <h3>Daily Views</h3>

        {chartData.length === 0 ? (
          <p>No daily views recorded yet.</p>
        ) : (
          <VictoryChart
            domainPadding={{ x: 40, y: 15 }}
            padding={{
              top: 30,
              bottom: 80,
              left: 55,
              right: 30,
            }}
          >
            <VictoryAxis
              tickValues={tickValues}
              tickFormat={(value) =>
                chartData.find((d) => d.x === value)?.dateLabel ?? ''
              }
              style={{
                tickLabels: {
                  angle: chartData.length > 1 ? -35 : 0,
                  fontSize: 11,
                  textAnchor: chartData.length > 1 ? 'end' : 'middle',
                  padding: 12,
                },
              }}
            />

            <VictoryAxis
              dependentAxis
              tickFormat={(value) =>
                Number.isInteger(value) ? value : ''
              }
              style={{
                tickLabels: {
                  fontSize: 11,
                },
              }}
            />

            <VictoryBar
              data={chartData}
              barWidth={chartData.length === 1 ? 35 : undefined}
              labelComponent={<VictoryTooltip />}
              style={{
                data: {
                  fill: '#444',
                },
              }}
            />
          </VictoryChart>
        )}
      </div>
    </div>
  )
}

RecipeStats.propTypes = {
  recipeId: PropTypes.string.isRequired,
}
