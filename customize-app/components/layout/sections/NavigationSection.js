import Listings from "../../Listings"
import { Tooltip } from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons'

const NavigationSection = (props) => (
  <section className="flex flex-col space-y-2">
    <label
      htmlFor="user-control-navigation"
      className="text-sm font-bold text-white dark:text-gray-200"
    >
      Listings <Tooltip label="Shows comparable rental listings based on location.
      " fontSize="md" placement='right-start'><QuestionIcon fontSize="sm" mt={-1} /></Tooltip>
    </label>
    <div id="user-control-navigation">
      {/* <Navigation /> */}
      {/* <Line /> */}
      <Listings listings={props.props.props} />
      {/* <LineChart monthAndYear={props.props.props?.monthAndYear} traffic={props.props.props?.traffic} /> */}
    </div>
  </section>
)

export default NavigationSection
