import Link from 'next/link';

import { fetchSubjects } from 'src/services';

// @ts-expect-error Server Component
const Exams: React.FC = async () => {
  const subjects = await fetchSubjects();

  return (
    <section className="h-full w-full flex flex-col items-center justify-center text-center">
      <p className="text-lg w-5/6 md:text-xl font-bold uppercase text-center px-4">
        <span className="text-primary">Escolhe</span> uma disciplina para fazer{' '}
        <span className="text-primary">o exame</span>
      </p>

      <section className="grid grid-cols-2 gap-x-4 px-6 md:grid-cols-4 gap-y-10 md:gap-x-10 mt-10 md:px-16">
        {subjects.map((subject) => (
          <Link
            href={`exams/${subject.id}/answer`}
            key={subject.id}
            className="w-full h-full md:h-48 p-5 flex flex-col space-y-6 items-center justify-center shadow border border-gray-100 rounded text-center group hover:bg-primary transition ease-in-out">
            <div className="w-full justify-center items-center overflow-auto">
              <p className="w-full text-xs md:text-xl font-bold capitalize line-clamp-6 group-hover:text-white">
                {subject.name}
              </p>
              <p className="w-full text-xs mt-4 uppercase group-hover:text-white">
                ({subject.slug})
              </p>
            </div>
          </Link>
        ))}
      </section>
    </section>
  );
};

export default Exams;
