import useMounted from "../../../utilities/hooks/useMounted"
import { SwitchFeedBorders } from "../../controls/ExtrasSwitches"
import FeedSlider from "../../controls/FeedSlider"
import Separator from "../../controls/Separator"
import { PaidTraffic } from "../../PaidTraffic"
import { OrganicKeywords } from "../../OrganicKeywords"
import { OrganicMonthlyTraffic } from "../../OrganicMonthlyTraffic"
import { VisibilityTrend } from "../../VisibilityTrend"
import { Tooltip } from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons'
import { Posts } from "../../Posts"

const FeedSection = (props) => {
  // console.log(props.props.props.tasks?.map((test) => test.result[0].items[0].metrics?.organic.count))

  return (
    <section className="flex flex-col space-y-2">
      <label
        htmlFor="user-control-feed-width"
        className="text-sm font-bold dark:text-twitterAccentOneDark text-twitterAccentOne"
      >
        General <Tooltip label="*Organic keywords:* Website's ranked keywords. *Monthly traffic:* Visitors per month.
*Visibility trend:* Website's search result visibility via paid traffic.
*Paid traffic cost:* Cost of recent paid traffic." fontSize="md" placement='right-start'><QuestionIcon fontSize="sm" mt={-1} /></Tooltip>
      </label>
      {/* {mounted ? (
        <div
          id="user-control-feed-width"
          className="p-4 pb-0 dark:bg-twitterBgTwoDark bg-twitterBgTwo rounded-2xl"
        >
          <FeedSlider />
          <Separator />
          <SwitchFeedBorders />
        </div>
      ) : (
        <div className="dark:bg-twitterBgTwoDark bg-twitterBgTwo rounded-2xl animate-pulse h-[115.5px]" />
      )} */}

      <div className="grid grid-cols-2 gap-4">
        <OrganicKeywords organicKeywords={props.props.props?.organicKeywords} />
        <OrganicMonthlyTraffic organicTraffic={props.props.props?.organicTraffic} />
        <VisibilityTrend visibility={props.props.props?.visibility} />
        <PaidTraffic paidTraffic={props.props.props?.paidTraffic} />
        {/* <Posts /> */}
      </div>

      {/* <div
        id="user-control-feed-width"
        className="p-4 pb-0 dark:bg-twitterBgTwoDark bg-twitterBgTwo rounded-2xl"
      >

      </div> */}
    </section >
  )
}
export default FeedSection
