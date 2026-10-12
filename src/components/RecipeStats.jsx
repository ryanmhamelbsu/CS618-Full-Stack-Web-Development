import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import {
  VictoryChart,
  VictoryTooltip,
  VictoryBar,
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

  return (
    <div>
      <b>{totalViews.data?.views} total views</b>

      <div style={{ width: 512, maxWidth: '100%' }}>
        <h3>Daily Views</h3>

        <VictoryChart domainPadding={16}>
          <VictoryBar
            labelComponent={<VictoryTooltip />}
            data={dailyViews.data?.map((d) => ({
              x: new Date(d._id),
              y: d.views,
              label: `${new Date(d._id).toLocaleDateString()}: ${d.views} views`,
            }))}
          />
        </VictoryChart>
      </div>
    </div>
  )
}

RecipeStats.propTypes = {
  recipeId: PropTypes.string.isRequired,
}