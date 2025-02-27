import { Action, ActionPanel, Form, getPreferenceValues, open } from "@raycast/api";

export default function Command() {
  const preferences = getPreferenceValues<{ defaultBang: string }>();
  const defaultBang = preferences.defaultBang;

  const handleSubmit = (values: { query: string }) => {
    const query = /!\w+/.test(values.query) ? values.query : `${values.query} ${defaultBang}`;
    open(`https://unduck.link?q=${encodeURIComponent(query)}`);
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Search" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description text="Search anything, everywhere, using thousands of available bangs 💥" />
      <Form.TextArea id="query" placeholder="alfredmouelle !ghrepo" />
      <Form.Description text="Credit : Theo Browne (t3dotgg)" />
    </Form>
  );
}
