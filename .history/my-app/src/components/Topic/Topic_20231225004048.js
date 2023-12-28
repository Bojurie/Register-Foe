import TopicDisplay from "../TopicDisplay/TopicDisplay";
import { fetchTopicsByCompanyCode } from "./services"; // Ensure this path is correct

const Topic = ({ companyCode }) => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const fetchedTopics = await fetchTopicsByCompanyCode(companyCode);
        setTopics(fetchedTopics);
      } catch (error) {
        console.error("Failed to load topics:", error);
        // Optionally, handle user feedback for error here
      }
    };

    loadTopics();
  }, [companyCode]);

  return <TopicDisplay topics={topics} />;
};

export default Topic;
