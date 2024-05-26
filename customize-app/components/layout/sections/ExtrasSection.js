import DoughnutChart from "../../DoughnutChart"
import { Tooltip } from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons'

const ExtrasSection = (props) => (
  // console.log(props.props.props?.traffic),
  <section className="flex flex-col space-y-2">
    <label
      htmlFor="user-control-extras"
      className="text-sm font-bold dark:text-twitterAccentOneDark text-twitterAccentOne"
    >
      Rankings <Tooltip label="Shows where the website ranks for specific keywords, categorized into five groups: pages 1-3, 4-10, 11-20, 31-40, and 51+. The number represents the keyword's position in search results, e.g., if on page 3, it's on the third page of results." fontSize="md" placement='top-start'><QuestionIcon fontSize="sm" mt={-1} /></Tooltip>
    </label>
    <div id="user-control-extras">
      {/* <Extras /> */}
      <DoughnutChart trafficData={props.props.props?.traffic} />
    </div>
    {/* <div className="text-center font-bold">Data by <a className="text-yellow-300" rel="noopener noreferrer" target="_blank" href="https://dataforseo.com/?aff=125639">DataForSeo</a></div> */}
  </section>
)

export default ExtrasSection
