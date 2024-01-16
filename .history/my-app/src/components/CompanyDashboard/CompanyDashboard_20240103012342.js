// import React, { useEffect, useState, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import WeatherWidget from "../WeatherWidget/WeatherWidget";
// import PastElectionList from "../PastElectionList/PastElectionList";
// import ElectionList from "../ElectionList /ElectionList";
// import ElectionRegistration from "../ElectionRegisteration/ElectionRegistration";
// import UserProfile from "../Profile/userProfile";
// import CreateTopicForm from "../CreateTopicForm/CreateTopicForm";
// import "./CompanyDashboard.css";
// import TopicWidget from "../TopicWidget/TopicWidget";
// import { getStoredToken } from "../LocalStorageManager/LocalStorageManager";
// import { useAuth } from "../AuthContext/AuthContext";
// import CreateNews from "../CompanyNews/CompanyNews";
// import SavedElections from "../SavedElections/SavedElections";




//   function CompanyDashboard() {
//     const [isElectionModalOpen, setIsElectionModalOpen] = useState(false);
//   const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
//   const [isCompanyNewsModalOpen, setIsCompanyNewsModalOpen] = useState(false);  
//   const { fetchUserByCompanyCode, getElections, user, fetchTopicsByCompanyCode } = useAuth();
//   const [candidatesList, setCandidatesList] = useState([]);
//   const [upcomingElections, setUpcomingElections] = useState([]);
//   const [topics, setTopics] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState({ candidates: true, elections: true, topics: true, users: true });
//   const [error, setError] = useState({});

//   const modalVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1 },
//     exit: { opacity: 0 },
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const candidatesResponse = await fetchUserByCompanyCode(
//           user.companyCode
//         );
//         const electionResponse = await getElections();
//         const topicResponse = await fetchTopicsByCompanyCode(user.companyCode);
//         const userResponse = await fetchUserByCompanyCode(user.companyCode);

//         setCandidatesList(candidatesResponse || []);
//         setUpcomingElections(electionResponse || []);
//         setTopics(topicResponse || []);
//         setUsers(userResponse || []);

//         setLoading({
//           candidates: false,
//           elections: false,
//           topics: false,
//           users: false,
//         });
//       } catch (e) {
//         console.error("Error loading data:", e);
//         setError(e);
//       }
//     };

//     if (user && user.isCompany && user.companyCode) {
//       fetchData();
//     }
//   }, [user, fetchUserByCompanyCode, getElections, fetchTopicsByCompanyCode]);

//   if (
//     loading.candidates ||
//     loading.elections ||
//     loading.topics ||
//     loading.users
//   ) {
//     return <div>Loading...</div>;
//   }

//   if (Object.keys(error).length) {
//     return <div>Error loading data. Please try again later.</div>;
//   }


//   return (
//     <div>
//       <motion.div
//         className="CompanyDashboard"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1.5 }}
//       >
//         <div className="Dashboard-Content">
//           <div className="Dashboard-Buttons">
//             <button onClick={() => setIsElectionModalOpen(true)}>
//               Register Election
//             </button>
//             <button onClick={() => setIsTopicModalOpen(true)}>
//               Create New Topic
//             </button>
//             <button onClick={() => setIsCompanyNewsModalOpen(true)}>
//               Post Company News
//             </button>
//           </div>
//         </div>
//         <div className="CompanyDashboard-Top">
//           <h1>Welcome, {user?.companyName || "Guest"}!</h1>
//           <WeatherWidget user={user} />
//         </div>

//         <div className="CompanyDashboard-Container">
//           <div className="CompanyDashboard-Content">
//             <div className="CompanyDashboard-Left">
//               <div className="CompanyDashboard-SavedElection">
//                 <SavedElections />
//               </div>
//               <div className="CompanyDashboard-PastElection">
//                 <PastElectionList userId={user?._id} />
//               </div>
//             </div>
//             <div className="CompanyDashboard-Center">
//               <div>
//                 <UserProfile users={users} />
//               </div>
//             </div>
//             <div className="CompanyDashboard-Right">
//               <div className="CompanyDashboard-Elections">
//                 <ElectionList elections={upcomingElections} />
//               </div>
//               <div className="CompanyDashboard-Topic">
//                 <TopicWidget topics={topics} />
//               </div>
//             </div>
//           </div>
//           <div className="CompanyDashboard-Bottom-Section">
//             <div></div>
//           </div>

//           <AnimatePresence>
//             {isElectionModalOpen && (
//               <Modal
//                 modalVariants={modalVariants}
//                 onClose={() => setIsElectionModalOpen(false)}
//                 ContentComponent={() => (
//                   <ElectionRegistration candidatesList={candidatesList} />
//                 )}
//               />
//             )}
//           </AnimatePresence>

//           <AnimatePresence>
//             {isTopicModalOpen && (
//               <Modal
//                 modalVariants={modalVariants}
//                 onClose={() => setIsTopicModalOpen(false)}
//                 ContentComponent={CreateTopicForm}
//               />
//             )}
//           </AnimatePresence>

//           <AnimatePresence>
//             {isCompanyNewsModalOpen && (
//               <Modal
//                 modalVariants={modalVariants}
//                 onClose={() => setIsCompanyNewsModalOpen(false)}
//                 ContentComponent={CreateNews}
//               />
//             )}
//           </AnimatePresence>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// const Modal = ({ modalVariants, onClose, ContentComponent }) => (
//   <motion.div
//     className="ModalBackdrop"
//     variants={modalVariants}
//     initial="hidden"
//     animate="visible"
//     exit="exit"
//     onClick={onClose}
//   >
//     <motion.div className="ModalContent" onClick={(e) => e.stopPropagation()}>
//       <ContentComponent />
//     </motion.div>
//   </motion.div>
// );

// export default CompanyDashboard;




import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardButtons from "./DashboardButtons";
import DashboardHeader from "../DashboardHeader";
import DashboardSections from "../DashboardSections/DashboardSections";
import LoadingScreen from "../LoadingScreen";
import ErrorScreen from "../ErrorScreen";
import ModalComponent from "../ModalComponent/ModalComponent";
import { useAuth } from "../AuthContext/AuthContext";
import "./CompanyDashboard.css";

function CompanyDashboard() {
    const [isElectionModalOpen, setIsElectionModalOpen] = useState(false);
    const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
    const [isCompanyNewsModalOpen, setIsCompanyNewsModalOpen] = useState(false);
    const { fetchUserByCompanyCode, getElections, user, fetchTopicsByCompanyCode } = useAuth();
    const [candidatesList, setCandidatesList] = useState([]);
    const [upcomingElections, setUpcomingElections] = useState([]);
    const [topics, setTopics] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState({ candidates: true, elections: true, topics: true, users: true });
    const [error, setError] = useState({});

    const modalVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const candidatesResponse = await fetchUserByCompanyCode(user.companyCode);
                const electionResponse = await getElections();
                const topicResponse = await fetchTopicsByCompanyCode(user.companyCode);
                const userResponse = await fetchUserByCompanyCode(user.companyCode);

                setCandidatesList(candidatesResponse || []);
                setUpcomingElections(electionResponse || []);
                setTopics(topicResponse || []);
                setUsers(userResponse || []);

                setLoading({
                    candidates: false,
                    elections: false,
                    topics: false,
                    users: false,
                });
            } catch (e) {
                console.error("Error loading data:", e);
                setError(e);
            }
        };

        if (user && user.isCompany && user.companyCode) {
            fetchData();
        }
    }, [user, fetchUserByCompanyCode, getElections, fetchTopicsByCompanyCode]);

    if (loading.candidates || loading.elections || loading.topics || loading.users) {
        return <LoadingScreen />;
    }

    if (Object.keys(error).length) {
        return <ErrorScreen />;
    }

    return (
        <div>
            <motion.div
                className="CompanyDashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
            >
                <DashboardHeader user={user} />
                <DashboardButtons 
                    setIsElectionModalOpen={setIsElectionModalOpen} 
                    setIsTopicModalOpen={setIsTopicModalOpen} 
                    setIsCompanyNewsModalOpen={setIsCompanyNewsModalOpen} 
                />
                <DashboardSections 
                    users={users} 
                    upcomingElections={upcomingElections} 
                    topics={topics} 
                    userId={user?._id}
                />

                <ModalComponent 
                    isModalOpen={isElectionModalOpen} 
                    setIsModalOpen={setIsElectionModalOpen} 
                    modalVariants={modalVariants} 
                    ContentComponent={ElectionRegistration} 
                    contentProps={{ candidatesList }}
                />
                <ModalComponent 
                    isModalOpen={isTopicModalOpen} 
                    setIsModalOpen={setIsTopicModalOpen} 
                    modalVariants={modalVariants} 
                    ContentComponent={CreateTopicForm} 
                />
                <ModalComponent 
                    isModalOpen={isCompanyNewsModalOpen} 
                    setIsModalOpen={setIsCompanyNewsModalOpen} 
                    modalVariants={modalVariants} 
                    ContentComponent={CreateNews} 
                />
            </motion.div>
        </div>
    );
}

export default CompanyDashboard;
