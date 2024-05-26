import LineChart from "../../LineChart"
import { Tooltip } from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons'

const NavigationSection = (props) => (
  <section className="flex flex-col space-y-2">
    <label
      htmlFor="user-control-navigation"
      className="text-sm font-bold dark:text-twitterAccentOneDark text-twitterAccentOne"
    >
      Traffic <Tooltip label="Shows the website's traffic changes over the last six months.
      " fontSize="md" placement='right-start'><QuestionIcon fontSize="sm" mt={-1} /></Tooltip>
    </label>
    <div id="user-control-navigation">
      {/* <Navigation /> */}
      {/* <Line /> */}
      <LineChart monthAndYear={props.props.props?.monthAndYear} traffic={props.props.props?.traffic} />
    </div>
  </section>
)

export default NavigationSection
