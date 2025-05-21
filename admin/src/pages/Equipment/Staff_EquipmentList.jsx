import { useEffect, useState } from "react";
import {
  getEquipment,
  searchEquipment,
  filterEquipmentByStatus
} from "../../services/api";
import {
  FilterButtons,
  SearchBar,
  Staff_TableView,
  Staff_CardView,
  EmptyState,
  LoadingSkeletons,
} from "../../components/EquipmentList";

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [displayEquipment, setDisplayEquipment] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await getEquipment();
      setEquipment(response.data);
      setDisplayEquipment(response.data);
    } catch (error) {
      setError("Failed to fetch equipment");
      console.error("Error fetching equipment:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  useEffect(() => {
    const fetchFilteredEquipment = async () => {
      try {
        setLoading(true);
        if (activeFilter === 'ALL') {
          const response = await getEquipment();
          setDisplayEquipment(response.data);
        } else {
          const response = await filterEquipmentByStatus(activeFilter);
          setDisplayEquipment(response.data);
        }
      } catch (error) {
        setError(`Failed to fetch equipment with status ${activeFilter}`);
        console.error("Error fetching filtered equipment:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredEquipment();
  }, [activeFilter]);

  const handleSearch = async () => {
    if (!search.trim()) {
      setDisplayEquipment(equipment);
      setSearchNotFound(false);
      return;
    }

    try {
      setLoading(true);
      setSearchNotFound(false);
      
      const response = await searchEquipment(search);
      if (response.data && response.data.length > 0) {
        setDisplayEquipment(response.data);
      } else {
        setSearchNotFound(true);
        setDisplayEquipment([]);
      }
    } catch (error) {
      setError("Error searching for equipment");
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusCounts = () => {
    const counts = {
      ALL: equipment.length,
      AVAILABLE: 0,
      UNAVAILABLE: 0,
      UNDER_MAINTENANCE: 0,
      OUT_OF_ORDER: 0
    };

    equipment.forEach(item => {
      if (counts[item.status] !== undefined) {
        counts[item.status]++;
      }
    });

    return counts;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-rose-700 to-rose-500 p-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="bg-white bg-opacity-30 p-2 rounded-lg mr-3 shadow-inner">
                <svg
                  className="w-6 h-6 text-red"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  ></path>
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">
                Equipment Inventory
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white border-opacity-20">
                <svg
                  className="w-5 h-5 text-red opacity-80 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  ></path>
                </svg>
                <span className="text-red font-medium">Total: {equipment.length} items</span>
              </div>
            </div>
          </div>

          <FilterButtons 
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            statusCounts={getStatusCounts()}
          />

          <SearchBar
            search={search}
            setSearch={setSearch}
            handleSearch={handleSearch}
            loading={loading}
            error={error}
            searchNotFound={searchNotFound}
          />

          <div className="hidden md:block overflow-x-auto rounded-lg mb-0">
            {loading ? (
              <LoadingSkeletons.TableSkeleton />
            ) : displayEquipment.length > 0 ? (
              <Staff_TableView
                displayEquipment={displayEquipment}
              />
            ) : (
              <EmptyState view="table" />
            )}
          </div>

          <div className="md:hidden p-4">
            {loading ? (
              <LoadingSkeletons.CardSkeleton />
            ) : displayEquipment.length > 0 ? (
              <Staff_CardView
                displayEquipment={displayEquipment}
              />
            ) : (
              <EmptyState view="card" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentList;