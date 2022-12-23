import React, { useEffect, useState } from "react";

import {
  getSiswa,
  putSiswaDetail,
  deleteSiswa,
  postSiswa,
} from "../Action/Siswa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import NavBar from "../Components/Navbar";
import Pagination from "../Components/Pagination";
import Modal from "../Components/Modal";
import { toast } from "react-toastify";
import TableSkeleton from "../Components/TableSkeleton";


export default function Dashboard() {
  const [pageQuery, setPageQuery] = useSearchParams();
  const { register, handleSubmit } = useForm();
  const QueryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [pageCounter, setPageCounter] = useState(1);

  const users = localStorage.getItem("user");
  const user = JSON.parse(users);
  const role = user?.role;

  const [modalData, setModalData] = useState({
    id: "",
    nama: "",
    alamat: "",
    kota: "",
    provinsi: "",
    email: "",
  });

  const { mutate: mutateEdit } = useMutation(putSiswaDetail);
  const { mutate: mutateAdd } = useMutation(postSiswa);
  const { mutate: mutateDelete } = useMutation(deleteSiswa);

  const { isLoading, data } = useQuery(["siswa", search, pageCounter], () =>
    getSiswa(pageCounter, search)
  );

  useEffect(() => {
    if (!showModal) {
      setModalData({
        id: "",
        nama: "",
        alamat: "",
        kota: "",
        provinsi: "",
        email: "",
      });
    }
  }, [showModal]);

  useEffect(() => {
    setPageQuery({ page: pageCounter });
  }, [pageCounter, setPageQuery]);

  const onSubmit = (data) => {
    setPageCounter(1);
    setSearch(data.search);
  };

  const handleOnChangeForm = (e) => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
  };

  const onChangeData = (isSuccess, message) => {
    if (isSuccess) {
      QueryClient.invalidateQueries(["siswa", search, pageCounter]);
      toast.success(message);
    } else {
      toast.error(message);
    }

    setShowModal(false);
  };

  return (
    <>
      <Modal
        show={showModal}
        data={modalData}
        onClose={() => setShowModal(false)}
        onChangeForm={(v) => handleOnChangeForm(v)}
        onSubmitForm={() => {
          if (modalData.id) {
            mutateEdit(modalData, {
              onSuccess: (res) => {
                onChangeData(true, res?.message);
              },
              onError: (res) => {
                onChangeData(false, res?.message);
              },
            });
          } else {
            mutateAdd(modalData, {
              onSuccess: (res) => {
                onChangeData(true, res?.message);
              },
              onError: (res) => {
                onChangeData(false, res?.message);
              },
            });
          }
        }}
      />

      <NavBar />

      <div className="container mt-5 mx-auto px-5 md:px-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
          >
            Search
          </label>
          <div className="relative flex justify-center">
            <input
              type="search"
              id="default-search"
              className="block p-4 pl-4 w-1/2 h-10 mr-5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500"
              placeholder="Search nama, alamat, kota, provinsi atau email.."
              {...register("search")}
            />

            <button
              type="submit"
              className="text-white w-24 bg-blue-700 h-10 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>

        {role === "admin" && (
          <div className="w-full flex justify-end mt-5 mb-5">
            <button
              type="button"
              className="text-white w-36 bg-blue-700 h-10 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => setShowModal(true)}
            >
              Add Siswa
            </button>
          </div>
        )}

        <div className="overflow-x-auto mt-5 mb-5 relative sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 light:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 light:bg-gray-700 light:text-gray-400">
              <tr>
                <th scope="col" className="px-5 py-3">
                  Nama
                </th>
                <th scope="col" className="px-5 py-3">
                  Alamat
                </th>
                {role === "user" && (
                <th scope="col" className="px-5 py-3">
                  Kota
                </th>
                )}
                {role === "user" && (
                <th scope="col" className="px-5 py-3">
                  Provinsi
                </th>
                )}
                <th scope="col" className="px-5 py-3">
                  Email
                </th>

                {role === "admin" && (
                  <th scope="col" className="px-20 py-3">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading && <TableSkeleton count={15} />}

              {!isLoading &&
                data?.data?.map((item, index) => {
                  return (
                    <tr
                      className="bg-white light:bg-gray-800 border-b"
                      key={index}
                    >
                      <td className="px-1 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 light:text-gray-200">
                              {item.nama}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap border-b">
                        <div className="text-sm text-gray-900 light:text-gray-200">
                          {item.alamat}
                        </div>
                      </td>
                      {role === "user" && (
                      <td className="px-5 py-4 whitespace-nowrap border-b">
                        <div className="text-sm text-gray-900 light:text-gray-200">
                          {item.kota}
                        </div>
                      </td>
                      )}
                      {role === "user" && (
                      <td className="px-5 py-4 whitespace-nowrap border-b">
                        <div className="text-sm text-gray-900 light:text-gray-200">
                          {item.provinsi}
                        </div>
                      </td>
                      )}
                      <td className="px-5 py-4 whitespace-nowrap border-b">
                        <div className="text-sm text-gray-900 light:text-gray-200">
                          {item.email}
                        </div>
                      </td>
                      {role === "admin" && (
                        <td className="px-10 py-4 whitespace-nowrap flex justify-between text-sm font-medium border-b">
                          <button
                            type="button"
                            className="text-white w-16 mr-15 bg-amber-700 h-8 hover:bg-amber-800 text-center flex items-center justify-center focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={() => {
                              setShowModal(true);
                              setModalData(item);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-white w-16 bg-red-700 h-8 hover:bg-red-800 focus:ring-4 focus:outline-none flex items-center justify-center focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                            onClick={() => {
                              mutateDelete(item.id, {
                                onSuccess: (res) => {
                                  onChangeData(true, res.message);
                                },
                                onError: (res) => {
                                  onChangeData(true, res.message);
                                },
                              });
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={pageCounter}
        prevPage={() => {
          setPageCounter((prev) => prev - 1);
        }}
        nextPage={() => {
          setPageCounter((next) => next + 1);
        }}
        hasMoreData={!(data?.data?.current_page === data?.data?.last_page)}
      />
    </>
  );
}