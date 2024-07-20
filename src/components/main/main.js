import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { Howl } from "howler";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Game from "../game/game";
import "./main.css";
import { useAccount } from "wagmi";
import { contractABI, contractAddress } from "./utils";
import { ethers } from "ethers";
import supabase from "./supabase";

export default function Main({ reactRoot, user }) {
  const { isConnected, address } = useAccount();
  const gameId = "71ab6ea3-dff2-4918-9674-bb0b9cd4a380";
  console.log("address: ", address);
  console.log("is connected: ", isConnected);

  const [play, setPlay] = useState(false);
  const [isNFTPresent, setNFTPresent] = useState(false);
  const [tokenId, setTokenId] = useState(undefined);
  const [activeTab, setActiveTab] = useState("#global-tab");
  const [leaderboard, setLeaderboard] = useState([]);
  const [noOfParticipants, setNoOfParticipants] = useState(0);

  let root;

  const [theme] = useState(
    new Howl({
      src: ["./audio/title_theme.wav"],
      loop: true,
      volume: 0.3,
    })
  );

  useEffect(() => {
    theme.play();
    window.addEventListener("keydown", (event) => {
      if (["ArrowUp", "ArrowDown"].includes(event.code)) {
        event.preventDefault();
      }
    });
  }, [theme]);

  useEffect(() => {
    async function checkNFT(address) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
      try {
        const balance = await contract.balanceOf(address);
        if (ethers.toBeHex(balance) > 0) {
          const tokenId = (
            await contract.tokenOfOwnerByIndex(address, 0)
          ).toString();
          setTokenId(tokenId);
          setNFTPresent(true);
        } else {
          setNFTPresent(false);
          setTokenId(null);
        }
      } catch (error) {
        console.error("Error checking NFT presence:", error);
        setNFTPresent(false);
        setTokenId(null);
      }
    }
    if (address) {
      checkNFT(address);
    }
  }, [address]);

  const handleSubmit = () => {
    const player = user ? user : undefined;
    theme.pause();

    if (!isConnected) {
      alert("Wallet is not connect");
      return;
    }

    if (isNFTPresent && tokenId) {
      if (reactRoot) {
        reactRoot.render(<Game player={player} reactRoot={reactRoot} />);
      } else {
        root = ReactDOM.createRoot(document.getElementById("subRoot"));
        setPlay(true);
      }
    } else {
      alert("NFT is not present to play");
      return;
    }
  };

  async function fetchLeaderboardData(tokenId, gameId) {
    try {
      let { data, error } = await supabase
        .from("points")
        .select("*")
        .eq("game_id", gameId)
        .order("points", { ascending: false });

      // if (activeTab === "#team-tab") {
      //   teamData?.sort((a, b) => b.points - a.points);

      //   data = teamData;
      // }

      if (error) throw error;
      setLeaderboard(data);
      setNoOfParticipants(data?.length ?? 1);

      // if (tokenId) {
      //   findCurrentTeamAndAvgScore(tokenId);
      // }
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  }

  console.log("react root: ");

  return (
    <div className="flex h-full w-full">
      <div className="h-screen w-1/3 bg-[#0142F5] px-4">
        <div className="font-Kangmas text-white text-[54px] text-start text-shadow my-9">
          You're score is{" "}
          <span id="top-score" className="font-Kangmas font-bold">
            0
          </span>{" "}
          Can be Higher↑
        </div>

        <div className="bg-white h-[calc(100vh-200px)] w-full rounded-tl-lg rounded-b-[40px] rounded-tr-[40px]">
          <p className="font-Geist-Regular text-[#0142F5] text-start px-4 py-6 text-sm">
            Bridge any amount of ETH from Ethereum Mainnet to Arbitrum and earn
            ARB tokens!
          </p>

          <p className="font-Geist-Regular text-[#0142F5] text-start px-4 pb-6 border-dashed border-b border-[#0142F5] border-spacing-12">
            Keep Pushing Higher↑
          </p>

          <div className="flex gap-4 w-full px-4 mt-4 mb-2 text-start">
            <div className="bg-[#F7F7F7] w-1/2 p-4 rounded-xl">
              <p className="font-Geist-Medium text-[13px] text-[#98989D]">
                Ends in
              </p>
              <p className="font-Geist-Medium text-[18px] text-[#0142F5] font-bold">
                24h 39m 34s
              </p>
            </div>
            <div className="bg-[#F7F7F7] w-1/2 p-4 rounded-xl">
              <p className="font-Geist-Medium text-[13px] text-[#98989D]">
                Participants
              </p>
              <p className="font-Geist-Medium text-[18px] text-[#0142F5] font-bold">
                198/200
              </p>
            </div>
          </div>

          <div className="px-4 h-[calc(100vh-590px)] lg:max-h-[calc(100vh-590px)] 2xl:max-h-[calc(100vh-650px)] mb-2">
            <div className="bg-[#F7F7F7] h-full w-full rounded-xl">
              <div className="p-3">
                <ul
                  className="bg-white rounded-md flex flex-row gap-[2px] justify-between font-Geist-Medium text-[13px] py-2"
                  id="leaderboardTabs"
                  role="tablist"
                >
                  <li className="nav-item px-6">
                    <a
                      className="nav-link active font-Geist-Medium"
                      id="global-tab"
                      data-toggle="tab"
                      href="#global"
                      role="tab"
                      aria-controls="global"
                      aria-selected="true"
                    >
                      Global Leaderboard
                    </a>
                  </li>
                  <li className="nav-item px-6">
                    <a
                      className="nav-link font-Geist-Medium"
                      id="team-tab"
                      data-toggle="tab"
                      href="#team"
                      role="tab"
                      aria-controls="team"
                      aria-selected="false"
                    >
                      Team Leaderboard
                    </a>
                  </li>
                </ul>
              </div>

              <div className="flex justify-between items-center font-Geist-Regular text-xs p-3">
                <span>#</span>
                <span>Token Id</span>
                <span>Score</span>
              </div>
              {}
            </div>
          </div>

          <div className="px-4 h-[calc(100vh-670px)] lg:max-h-[calc(100vh-590px)] 2xl:lg:max-h-[calc(100vh-800px)] mb-2">
            <div className="bg-[#F7F7F7] h-full w-full rounded-xl"></div>
          </div>
          <div className="px-4" onClick={handleSubmit}>
            <button className="rounded-[100px] w-full text-white bg-[#0142F5] font-Geist-Medium text-sm h-12 border-none">
              Play
            </button>
          </div>
        </div>
      </div>
      <div className="ml-20 w-2/3">
        {play ? (
          <Game player={undefined} reactRoot={root} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <img src="/pacman.png" />
            <span className="font-Crackman text-[#0142F5] text-9xl mt-6">
              PAC-MAN
            </span>
          </div>
        )}
      </div>
      <div className="absolute right-24 top-2">
        <ConnectButton />
      </div>
    </div>
  );
}

// function MainPage({ player, root }) {
//   return (
//     <div className="flex h-full w-full">
//       <div className="h-screen w-1/3 bg-[#0142F5] px-4">
//         <div className="font-Kangmas text-white text-[54px] text-start text-shadow my-9">
//           You're score is{" "}
//           <span id="top-score" className="font-Kangmas font-bold">
//             0
//           </span>{" "}
//           Can be Higher↑
//         </div>

//         <div className="bg-white h-[calc(100vh-200px)] w-full rounded-tl-lg rounded-b-[40px] rounded-tr-[40px]">
//           <p className="font-Geist-Regular text-[#0142F5] text-start px-4 py-6 text-sm">
//             Bridge any amount of ETH from Ethereum Mainnet to Arbitrum and earn
//             ARB tokens!
//           </p>

//           <p className="font-Geist-Regular text-[#0142F5] text-start px-4 pb-6 border-dashed border-b border-[#0142F5] border-spacing-12">
//             Keep Pushing Higher↑
//           </p>

//           <div className="flex gap-4 w-full px-4 mt-4 mb-2 text-start">
//             <div className="bg-[#F7F7F7] w-1/2 p-4 rounded-xl">
//               <p className="font-Geist-Medium text-[13px] text-[#98989D]">
//                 Ends in
//               </p>
//               <p className="font-Geist-Medium text-[18px] text-[#0142F5] font-bold">
//                 24h 39m 34s
//               </p>
//             </div>
//             <div className="bg-[#F7F7F7] w-1/2 p-4 rounded-xl">
//               <p className="font-Geist-Medium text-[13px] text-[#98989D]">
//                 Participants
//               </p>
//               <p className="font-Geist-Medium text-[18px] text-[#0142F5] font-bold">
//                 198/200
//               </p>
//             </div>
//           </div>

//           <div className="px-4 h-[calc(100vh-590px)] lg:max-h-[calc(100vh-590px)] 2xl:max-h-[calc(100vh-650px)] mb-2">
//             <div className="bg-[#F7F7F7] h-full w-full rounded-xl">
//               <div className="p-3">
//                 <ul
//                   className="bg-white rounded-md flex flex-row gap-[2px] justify-between font-Geist-Medium text-[13px] py-2"
//                   id="leaderboardTabs"
//                   role="tablist"
//                 >
//                   <li className="nav-item px-6">
//                     <a
//                       className="nav-link active font-Geist-Medium"
//                       id="global-tab"
//                       data-toggle="tab"
//                       href="#global"
//                       role="tab"
//                       aria-controls="global"
//                       aria-selected="true"
//                     >
//                       Global Leaderboard
//                     </a>
//                   </li>
//                   <li className="nav-item px-6">
//                     <a
//                       className="nav-link font-Geist-Medium"
//                       id="team-tab"
//                       data-toggle="tab"
//                       href="#team"
//                       role="tab"
//                       aria-controls="team"
//                       aria-selected="false"
//                     >
//                       Team Leaderboard
//                     </a>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           <div className="px-4 h-[calc(100vh-670px)] lg:max-h-[calc(100vh-590px)] 2xl:lg:max-h-[calc(100vh-800px)] mb-2">
//             <div className="bg-[#F7F7F7] h-full w-full rounded-xl"></div>
//           </div>
//           <div className="px-4">
//             <button className="rounded-[100px] w-full text-white bg-[#0142F5] font-Geist-Medium text-sm h-12 border-none">
//               Play
//             </button>
//           </div>
//         </div>
//       </div>
//       <div className="ml-20 w-2/3">
//         <Game player={player} reactRoot={root} />
//       </div>
//       <div className="absolute right-24 top-2">
//         <ConnectButton />
//       </div>
//     </div>
//   );
// }
