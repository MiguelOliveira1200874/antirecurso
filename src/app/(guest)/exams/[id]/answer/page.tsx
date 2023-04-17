'use client';

import { useContext, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import swal from 'sweetalert';

import PrimaryButton from '@/components/PrimaryButton';

import { ExamContext } from 'src/contexts/ExamContext';
import { useToken } from 'src/hooks/useToken';
import { BASE_URL } from 'src/services/api';
import generateExam from 'src/services/generateExam';
import Question from 'src/types/Question';
import getSubjectNameById from 'src/utils/getSubjectNameById';

import { Check } from '@/styles/Icons';

interface ExamPageProps {
  params: {
    id: string;
  };
}

const N_SKELETON_QUESTIONS = 10;
const N_SKELETON_OPTIONS = 4;

const Exam: React.FC<ExamPageProps> = ({ params }) => {
  const router = useRouter();
  const { setExamResult, subject, setSubject } = useContext(ExamContext);

  const [questions, setQuestions] = useState<Question[]>([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map<number, number>());

  function changeQuestion(i: number) {
    if (i >= 0 && i < questions.length) setCurrentQuestionIndex(i);
  }

  function hasAnsweredAllQuestions(): boolean {
    if (answers.size === questions.length) return true;

    return false;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!hasAnsweredAllQuestions()) {
      const confirmed = await swal({
        title: 'Não respondeu a todas as questões do exame.',
        text: 'Tem a certeza que quer terminar o exame?',
        icon: 'warning',
        buttons: ['Cancelar', 'Continuar']
      });

      if (!confirmed) return;
    }

    const confirmed = await swal({
      title: 'Tem a certeza que quer terminar o exame?',
      icon: 'warning',
      buttons: ['Não', 'Sim']
    });

    if (!confirmed) return;

    handleConfirm();
  }

  async function handleConfirm() {
    const data = {
      subject_id: parseInt(params.id),
      answers: Array.from(answers.entries()).map(([question, answer]) => ({
        question_id: questions[question].id,
        selected_option: answer
      }))
    };

    const { token } = await useToken();

    const res = await fetch(`${BASE_URL}/exams/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (res.status === 200) {
      setExamResult(await res.json());
      router.push(`/exams/${params.id}/points`);
    } else swal('Ocorreu um erro ao submeter o exame.', 'Por favor tente novamente.', 'error');
  }

  function selectAnswer(question: number, order: number) {
    setAnswers((prev) => {
      const newAnswers = new Map(prev);
      newAnswers.set(question, order);
      return newAnswers;
    });

    changeQuestion(currentQuestionIndex + 1);
  }

  function wasAnswered(i: number) {
    return answers.has(i);
  }

  async function getExam(id: number) {
    const exam = await generateExam(id);
    setQuestions(exam);
  }

  async function setSubjectName() {
    setSubject(await getSubjectNameById(parseInt(params.id)));
  }

  useEffect(() => {
    getExam(parseInt(params.id));
    setSubjectName();
  }, []);

  useEffect(() => {
    setCurrentQuestion(questions[currentQuestionIndex]);
  }, [questions, currentQuestionIndex]);

  return (
    <section className="h-screen flex flex-col items-center">
      <p className="text-xl font-bold uppercase mt-10 ml-5">
        Exame de <span className="text-primary">{subject}</span>
      </p>
      <div className="mb-12">
        {questions[0] ? (
          <div className="w-screen flex items-center md:justify-center space-x-10 overflow-x-scroll md:overflow-auto mt-5 px-5">
            {questions.map((question, i) => (
              <div
                key={question.id}
                onClick={() => changeQuestion(i)}
                className={`h-10 w-10 p-5 flex items-center justify-center ${
                  currentQuestionIndex === i
                    ? 'bg-primary text-white'
                    : wasAnswered(i)
                    ? 'bg-primary bg-opacity-70 text-white'
                    : 'border border-primary text-primary'
                }
            rounded-full hover:cursor-pointer`}>
                <p>{i + 1}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-screen flex  items-center md:justify-center space-x-10 overflow-x-scroll md:overflow-auto mt-5 px-5">
            {Array.from({ length: N_SKELETON_QUESTIONS }).map((_, i) => (
              <Skeleton className="h-10 w-10 p-5 flex items-center justify-center " circle={true} />
            ))}
          </div>
        )}
        <section className="mt-5 px-5 md:px-32">
          <div className="relative w-full h-48">
            <Image
              fill
              alt="Subject"
              className="object-cover h-full w-full"
              src="/images/prcmp.jpg"
            />
          </div>

          {currentQuestion ? (
            <section className="mb-10">
              <p className="text-lg font-bold mt-5">{currentQuestion.question}</p>
              <p className="text-sm text-gray-600 mt-2">
                Tipo de pergunta '{currentQuestion.question_type}' do exame '{currentQuestion.exam}'
              </p>
              <div className="mt-5 space-y-5">
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.name}
                    onClick={() => selectAnswer(currentQuestionIndex, option.order)}
                    className={`w-full flex items-center px-5 py-3 border border-gray-100 h-20 rounded hover:cursor-pointer hover:bg-primary hover:text-white transition ease-in-out ${
                      answers.get(currentQuestionIndex) === option.order && 'bg-primary text-white'
                    }`}>
                    <p>{option.name}</p>
                    {answers.get(currentQuestionIndex) === option.order && (
                      <Check className="ml-5" />
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <div className="mt-12">
              <Skeleton className="h-20 mt-6" count={N_SKELETON_OPTIONS} />
            </div>
          )}

          {currentQuestionIndex === questions.length - 1 && (
            <div className="w-full mb-6 flex justify-end">
              <form onSubmit={handleSubmit}>
                <PrimaryButton>Terminar</PrimaryButton>
              </form>
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

export default Exam;