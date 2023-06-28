import Image from 'next/image';
import { BASE_URL } from 'src/services/api';
import Leaderboard from 'src/types/Leaderboard';
import getSubjectNameById from 'src/utils/getSubjectNameById';

interface ScoreboardPageProps {
  params: {
    id: string;
  };
}

// @ts-expect-error Server Component
const ScoreboardPage: React.FC<ScoreboardPageProps> = async ({ params }) => {
  const subjectName = await getSubjectNameById(parseInt(params.id));
  const scoreboard = await fetchLeaderboard();

  async function fetchLeaderboard(): Promise<Leaderboard> {
    const res = await fetch(BASE_URL + '/subjects/' + params.id + '/scoreboard', {
      cache: 'no-cache'
    });
    return res.json();
  }

  return (
    <section className="min-h-[90vh] flex flex-col items-center my-16">
      <p className="text-xl font-bold uppercase text-center px-4">
        Scoreboard de <span className="text-primary">{subjectName}</span>
      </p>

      <section className="mt-5 w-full md:px-16 grid place-items-center">
        {scoreboard.scores.length === 0 ? (
          <p className="text-center">Sem nenhum utilizador registado</p>
        ) : (
          <>
            {/* Year Selector, future implementation */}
            {/* <div className="flex flex-row justify-end">
              <div className="inline-flex items-center gap-1">
                <p className="text-center">2023</p>
                <MdKeyboardArrowDown />
              </div>
            </div> */}
            {/* Podium */}
            <div className="flex flex-row justify-center items-start mb-6">
              <div className="flex flex-col items-center px-14 pt-24">
                <Image
                  className="w-32 rounded-full aspect-square"
                  src="/images/podium/silver.svg"
                  alt="User 1"
                  width={80}
                  height={80}
                />
                <div className="flex flex-col items-center py-4">
                  <p className="text-2xl font-bold">Nome 2</p>
                  <p className="text-2xl font-bold bg-orange-200 px-4 rounded-full">93.83</p>
                </div>
              </div>
              <div className="flex flex-col items-center bg-gradient-to-b from-primary to-transparent rounded-t-2xl px-14 py-12">
                <div className="relative">
                  <Image
                    className="w-32 rounded-full aspect-square"
                    src="/images/default-avatar.svg"
                    alt="User 2"
                    width={80}
                    height={80}
                  />
                  <Image
                    className="w-8 rounded-full aspect-square absolute right-0 top-0"
                    src="/images/podium/gold-small.svg"
                    alt="User 2"
                    width={80}
                    height={80}
                  />
                </div>
                <div className="flex flex-col items-center py-4">
                  <p className="text-2xl font-bold">Nome 1</p>
                  <p className="text-2xl font-bold">97.60</p>
                </div>
              </div>
              <div className="flex flex-col items-center px-14 pt-24">
                <Image
                  className="w-32 rounded-full aspect-square"
                  src="/images/podium/bronze.svg"
                  alt="User 3"
                  width={80}
                  height={80}
                />
                <div className="flex flex-col items-center py-4">
                  <p className="text-2xl font-bold">Nome 3</p>
                  <p className="text-2xl font-bold">93.14</p>
                </div>
              </div>
            </div>
            <table className="w-1/2 text-sm text-center">
              <tbody>
                {scoreboard.scores.map((line, key) => (
                  // key == 0 as example to highlight the "you" line
                  <tr
                    className={`${key == 0 ? 'bg-orange-200' : ''} text-xl font-bold`}
                    key={line.user_id}>
                    <th
                      scope="row"
                      className="pl-6 md:pl-16 pr-6 py-3 whitespace-nowrap rounded-l-full">
                      {key + 1}
                    </th>
                    <td className="pl-4 py-2 min-w-[3.5rem]">
                      <Image
                        className="w-9 rounded-full aspect-square"
                        src="/images/default-avatar.svg"
                        alt={line.user_name}
                        width={40}
                        height={40}
                      />
                    </td>
                    <td className="px-4 py-2 md:min-w-[28rem]">
                      <div className="flex flex-col items-start">
                        <span className="text-lg leading-5">{line.user_name}</span>
                        <span className="text-sm leading-3 text-gray-500">{line.exams} exames</span>
                      </div>
                    </td>
                    <td className="px-6 md:pr-16 py-2 rounded-r-full">{line.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>
    </section>
  );
};

export default ScoreboardPage;
