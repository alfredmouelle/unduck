import { Action, ActionPanel, Form, getPreferenceValues, LocalStorage, open } from "@raycast/api";
import { useEffect, useState } from "react";

const STORAGE_KEY = "searches";
const SEARCH_URL = "https://unduck.link?q=%s";

export default function Command() {
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const preferences = getPreferenceValues<Preferences>();
  useEffect(() => {
    const loadSearches = async () => {
      const savedSearches = await LocalStorage.getItem<string>(STORAGE_KEY);
      if (savedSearches) setSavedSearches(JSON.parse(savedSearches));
    };
    loadSearches();
  }, []);

  const handleSubmit = async (values: { query: string; saveSearch: boolean; savedSearches: string }) => {
    let searchQuery = values.savedSearches;
    if (!searchQuery.length) {
      searchQuery = /!\w+/.test(values.query) ? values.query : `${values.query} ${preferences.defaultBang}`;
    }
    if (!searchQuery.length) return;
    open(SEARCH_URL.replace("%s", encodeURIComponent(searchQuery)));
    if (values.saveSearch && values.query && !savedSearches.includes(values.query)) {
      const newSavedSearches = [values.query, ...savedSearches];
      setSavedSearches(newSavedSearches);
      await LocalStorage.setItem(STORAGE_KEY, JSON.stringify(newSavedSearches));
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Search" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea id="query" placeholder="alfredmouelle !ghrepo" />

      <Form.Checkbox id="saveSearch" label="Save Search" defaultValue={preferences.saveSearch} />

      <Form.Dropdown id="savedSearches" title="Saved Searches">
        <Form.Dropdown.Item key="0" value="" title="No saved searches" />

        {savedSearches.map((search, index) => (
          <Form.Dropdown.Item key={index + 1} value={search} title={search} />
        ))}
      </Form.Dropdown>

      <Form.Separator />

      <Form.Description text="Credit : Theo Browne (t3dotgg)" />
    </Form>
  );
}
