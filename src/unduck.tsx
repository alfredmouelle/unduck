import { Action, ActionPanel, Form, getPreferenceValues, LocalStorage, open } from "@raycast/api";
import { useEffect, useState } from "react";

export default function Command() {
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const preferences = getPreferenceValues<{ defaultBang: string; saveSearch: boolean }>();

  useEffect(() => {
    const loadSearches = async () => {
      const savedSearches = await LocalStorage.getItem<string>("searches");
      if (savedSearches) setSavedSearches(JSON.parse(savedSearches));
    };
    loadSearches();
  }, []);

  const handleSubmit = async (values: { query: string; saveSearch: boolean; savedSearches: string }) => {
    let searchQuery = values.savedSearches;
    if (!searchQuery.length) {
      searchQuery = /!\w+/.test(values.query) ? values.query : `${values.query} ${preferences.defaultBang}`;
    }
    open(`https://unduck.link?q=${encodeURIComponent(searchQuery)}`);
    if (values.saveSearch && values.query && !savedSearches.includes(values.query)) {
      const newSavedSearches = [...savedSearches, values.query];
      setSavedSearches(newSavedSearches);
      await LocalStorage.setItem("searches", JSON.stringify(newSavedSearches));
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
