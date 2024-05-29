import AffiliateSection from "./sections/AffiliateSection"
import ExtrasSection from "./sections/ExtrasSection"
import FeedSection from "./sections/FeedSection"
import NavigationSection from "./sections/NavigationSection"

const Main = (props) => (
  <main className="flex flex-col p-2 space-y-4">
    <FeedSection props={props} />
    <NavigationSection props={props} />
    <ExtrasSection props={props} />
    {/* <AffiliateSection /> */}
  </main>
)

export default Main
