'use client';

import { Menu } from '@/styles/Icons';
import Link from 'next/link';
import { useState } from 'react';
import PrimaryButton from '../PrimaryButton';

const Topbar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  function handleClickMenu() {
    setIsOpen((state) => !state);
  }

  return (
    <div className="w-screen h-20 flex items-center justify-between py-5 px-10 bg-white shadow border-gray-100 sticky top-0 left-0">
      <Link href="/" className="w-32 md:w-48">
        <img src="/images/logo.png" alt="Our beautiful logo" className="w-full" />
      </Link>
      <div className="hidden md:flex md:items-center">
        <div className="space-x-10">
          <Link href="/" className="hover:text-primary transition ease-in-out">
            Home
          </Link>
          <Link href="/exams" className="hover:text-primary transition ease-in-out">
            Exames
          </Link>
          <Link href="/scoreboard" className="hover:text-primary transition ease-in-out">
            Scoreboard
          </Link>
          <Link href="/documents" className="hover:text-primary transition ease-in-out">
            Documentos
          </Link>
        </div>
        <div className="ml-5">
          {isAuthenticated ? (
            <form action="/profile">
              <PrimaryButton>Aceder ao perfil</PrimaryButton>
            </form>
          ) : (
            <form action="/register">
              <PrimaryButton>Criar uma conta</PrimaryButton>
            </form>
          )}
        </div>
      </div>
      <div className="flex md:hidden" x-data="{ open: false }">
        <Menu className="text-primary hover:cursor-pointer" onClick={handleClickMenu} />
        {isOpen && (
          <div className="absolute left-0 top-20 w-screen bg-white h-auto p-5 border border-gray-100 shadow rounded flex flex-col space-y-5">
            <Link href="/" className="hover:text-primary transition ease-in-out">
              Home
            </Link>
            <Link href="/exams" className="hover:text-primary transition ease-in-out">
              Exames
            </Link>
            <Link href="/scoreboard" className="hover:text-primary transition ease-in-out">
              Scoreboard
            </Link>
            <Link href="/documents" className="hover:text-primary transition ease-in-out">
              Documentos
            </Link>

            <div className="mt-5">
              {isAuthenticated ? (
                <form action="/profile">
                  <PrimaryButton className="w-full">Aceder ao perfil</PrimaryButton>
                </form>
              ) : (
                <form action="/register">
                  <PrimaryButton className="w-full">Criar uma conta</PrimaryButton>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;