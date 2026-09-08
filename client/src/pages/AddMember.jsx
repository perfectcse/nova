import { useEffect, useState } from "react";
import api from "../service/api";
import "../styles/addMember.css";

function AddMember({
  projectId,
  existingMembers = [],
  onMemberAdded,
  onCancel,
}) {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        setError("");

        const response = await api.get("/auth/users");

        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Fetch users error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load users."
        );
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Remove users who are already members of this project
  const availableUsers = users.filter(
    (user) =>
      !existingMembers.some(
        (member) => member._id === user._id
      )
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedUserId) {
      setError("Please select a user.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await api.post(`/projects/${projectId}/members`, {
        userId: selectedUserId,
      });

      onMemberAdded();
    } catch (error) {
      console.error("Add member error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to add member. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-member-overlay">
      <div className="add-member-card">
        <div className="add-member-header">
          <div>
            <h2>Add Team Member</h2>

            <p>
              Select an existing NOVA user to add to this
              project.
            </p>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={onCancel}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="member-user">
              Team Member
            </label>

            {loadingUsers ? (
              <div className="member-loading">
                Loading users...
              </div>
            ) : availableUsers.length === 0 ? (
              <div className="member-empty">
                No available users to add.
              </div>
            ) : (
              <select
                id="member-user"
                value={selectedUserId}
                onChange={(event) =>
                  setSelectedUserId(event.target.value)
                }
                disabled={loading}
                required
              >
                <option value="">
                  Select a team member
                </option>

                {availableUsers.map((user) => (
                  <option
                    key={user._id}
                    value={user._id}
                  >
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          {error && (
            <p className="add-member-error">
              {error}
            </p>
          )}

          <div className="add-member-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={
                loading ||
                loadingUsers ||
                availableUsers.length === 0
              }
            >
              {loading ? "Adding..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMember;